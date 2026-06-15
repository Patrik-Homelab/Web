<script lang="ts">
  /* eslint-disable @typescript-eslint/no-explicit-any */
  import {
    Button as BaseButton,
    Input as BaseInput,
    DatePicker,
    FormItem,
    Select
  } from '$/components/form';
  import H1 from '$/components/headers/H1.svelte';
  import {
    Button,
    Form,
    GeminiInput,
    ImageManager,
    Input,
    Markdown,
    TextArea,
    Select as FormSelect
  } from '$/components/newForm';
  import DataProvider from '$/components/newForm/DataProvider.svelte';
  import type { FormAction } from '$/components/newForm/Form.svelte';
  import LanguageSelector from '$/components/newForm/LanguageSelector.svelte';
  import { Table, TBody, Td, Th, THead, Tr } from '$/components/table';
  import { Card, Icon } from '$/components/utility';
  import { formatDate, SwalAlert } from '$/lib/functions';
  import { languages, resolveError, transformIntoLanguagable } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import type { Exposure } from '$/types/database';
  import { articleSchema } from '$/types/schemes';
  import { NROT } from '$/types/types';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/state';
  import type { Selectable } from 'kysely';
  import type { PageProps, SubmitFunction } from './$types';
  import { API } from '$/lib/api';

  const { data }: PageProps = $props();
  const { dynamicTranslations } = data;

  const _state = getState();
  const _lang = $derived(_state.lang.admin.article.form);

  const MultiLangKeys = NROT(['title', 'description', 'content_md', 'images'] as const);

  const articleData = $state(
    transformIntoLanguagable(
      data.article as unknown as Record<string, unknown>,
      dynamicTranslations,
      MultiLangKeys
    ) as Record<string, any>
  );

  const currentArticleData = $derived(
    articleData[_state.selectedLang as keyof typeof languages] as Record<string, unknown>
  );
  const sysPrompt = `Jsi astrofotograf a redaktor. Napiš krátký, poutavý a poetický popisek (max 150 znaků) pro článek s názvem '{{title}}'.

Tón: Poetický, úderný, obdivující krásu vesmíru.
Příklady stylu, který musíš dodržet:
- Mlhovina Bublina: Vesmírná křehkost v záplavě hvězd.
- Andromeda: Ostrost bez kompromisů.
- Orlí mlhovina: Domov slavných Pilířů stvoření.
- Spirální galaxie: Jehlicový klenot hlubokého vesmíru.

Nyní napiš popisek pro tento obsah (pouze text, žádné uvozovky):
{{content}}`;

  const editing = $derived('id' in data.article);
  let showPreview = $state(false);
  let selectedEquipment = $state<null | number>(null);

  let equipment = $state<number[]>((data.article as any).equipment ?? []);

  $effect(() => {
    if (selectedEquipment !== null) {
      equipment.push(selectedEquipment);
      selectedEquipment = null;
    }
  });

  let exposureDate = $state<Date | undefined>(undefined);
  let exposureType = $state('light');
  let exposureCount = $state(1);
  let exposureDuration = $state(30);
  let exposures = $state<Selectable<Exposure>[]>((data.article as any).exposures ?? []);

  const addExposure = () => {
    exposures.push({
      id: -1,
      type: exposureType,
      date: exposureDate ?? new Date(),
      count: exposureCount,
      exposure_time_s: exposureDuration,
      article_id: page.params.id ?? ''
    });
  };

  let newObjectCs = $state('');
  let newObjectEn = $state('');

  let ra = $state<number | null>((data.article as any).ra ?? null);
  let dec = $state<number | null>((data.article as any).dec ?? null);
  let fovWidth = $state<number | null>((data.article as any).fov_width ?? null);
  let fovHeight = $state<number | null>((data.article as any).fov_height ?? null);
  let fovRotation = $state<number | null>((data.article as any).fov_rotation ?? null);

  let isResolving = $state(false);

  const searchAstroDb = async (ev: MouseEvent) => {
    ev.preventDefault();
    const query = newObjectEn || newObjectCs;
    if (!query) {
      SwalAlert({
        title:
          _state.selectedLang === 'cs'
            ? 'Zadejte název objektu pro vyhledání'
            : 'Enter object name to search',
        icon: 'warning'
      });
      return;
    }

    isResolving = true;
    try {
      const res = await API.astronomical_object.resolve({ name: query });
      if (res && res.status && res.ra !== undefined && res.dec !== undefined) {
        ra = res.ra;
        dec = res.dec;
        if (!newObjectEn) {
          newObjectEn = query;
        }
        SwalAlert({
          title:
            _state.selectedLang === 'cs'
              ? `Objekt nalezen! Souřadnice RA: ${res.ra}°, DEC: ${res.dec}° byly doplněny.`
              : `Object found! Coordinates RA: ${res.ra}°, DEC: ${res.dec}° have been auto-filled.`,
          icon: 'success'
        });
      } else {
        SwalAlert({
          title:
            _state.selectedLang === 'cs'
              ? 'Objekt nebyl v astronomické databázi nalezen.'
              : 'Object was not found in the astronomical database.',
          icon: 'error'
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      SwalAlert({
        title:
          _state.selectedLang === 'cs'
            ? 'Chyba při vyhledávání objektu.'
            : 'Error while searching for the object.',
        icon: 'error'
      });
    } finally {
      isResolving = false;
    }
  };

  const calculateFov = (ev: MouseEvent) => {
    ev.preventDefault();
    const telescopes = data.equipment.filter(
      (item: any) => equipment.includes(item.id) && item.type_id === 1
    );
    const cameras = data.equipment.filter(
      (item: any) => equipment.includes(item.id) && item.type_id === 2
    );

    if (telescopes.length === 0 || cameras.length === 0) {
      SwalAlert({
        title:
          _state.selectedLang === 'cs'
            ? 'Pro výpočet musíte mít vybraný alespoň 1 dalekohled a 1 kameru!'
            : 'You must have at least 1 telescope and 1 camera selected for calculation!',
        icon: 'warning'
      });
      return;
    }

    // Look for telescope and camera that have all required specifications
    const telescope = telescopes.find(
      (t: any) => t.focal_length !== null && t.focal_length !== undefined
    );
    const camera = cameras.find(
      (c: any) =>
        c.pixel_size !== null &&
        c.pixel_size !== undefined &&
        c.sensor_width !== null &&
        c.sensor_width !== undefined &&
        c.sensor_height !== null &&
        c.sensor_height !== undefined
    );

    if (!telescope || !camera) {
      SwalAlert({
        title:
          _state.selectedLang === 'cs'
            ? 'Mezi vybraným vybavením nebyl nalezen žádný dalekohled nebo kamera s vyplněnými technickými specifikacemi (ohnisková délka, velikost pixelu nebo rozlišení senzoru)!'
            : 'Among the selected equipment, no telescope or camera was found with technical specifications filled (focal length, pixel size, or sensor resolution)!',
        icon: 'warning'
      });
      return;
    }

    const fovW =
      ((camera.sensor_width! * camera.pixel_size!) / (1000 * telescope.focal_length!)) *
      57.2957795;
    const fovH =
      ((camera.sensor_height! * camera.pixel_size!) / (1000 * telescope.focal_length!)) *
      57.2957795;

    fovWidth = parseFloat(fovW.toFixed(3));
    fovHeight = parseFloat(fovH.toFixed(3));

    SwalAlert({
      title:
        _state.selectedLang === 'cs'
          ? `Zorné pole (FOV) bylo vypočítáno pomocí ${telescope.name} a ${camera.name}: ${fovWidth}° × ${fovHeight}°`
          : `Field of View (FOV) calculated using ${telescope.name} and ${camera.name}: ${fovWidth}° × ${fovHeight}°`,
      icon: 'success'
    });
  };

  const addNewObject = async (ev: MouseEvent) => {
    ev.preventDefault();
    if (!newObjectCs || !newObjectEn) {
      SwalAlert({
        title:
          _state.selectedLang === 'cs'
            ? 'Zadejte název v obou jazycích'
            : 'Enter names in both languages',
        icon: 'error'
      });
      return;
    }
    try {
      const res = await API.astronomical_object.create({
        cs: newObjectCs,
        en: newObjectEn
      });
      if (res && res.status) {
        SwalAlert({
          title:
            _state.selectedLang === 'cs'
              ? 'Objekt byl úspěšně přidán!'
              : 'Object successfully added!',
          icon: 'success'
        });
        newObjectCs = '';
        newObjectEn = '';
        await invalidateAll();
      } else {
        SwalAlert({
          title:
            _state.selectedLang === 'cs'
              ? 'Nepodařilo se přidat objekt.'
              : 'Failed to add object.',
          icon: 'error'
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      SwalAlert({
        title: _state.selectedLang === 'cs' ? 'Chyba serveru.' : 'Server error.',
        icon: 'error'
      });
    }
  };

  const action = (({ result }) => {
    // @ts-expect-error dynamic result type
    const data = result.data as any;

    if (result.type === 'success' && data?.status) {
      SwalAlert({
        title: editing ? _lang.updated : _lang.created,
        icon: 'success'
      });
      goto(`/${_state.selectedLang}/admin/article`);
    } else if (result.type === 'failure' || (data && !data.status)) {
      SwalAlert({
        title: resolveError(data?.message || 'error.unknown', _state.lang),
        icon: 'error'
      });
    }
  }) satisfies FormAction<SubmitFunction, ReturnType<typeof articleSchema>, true>;
</script>

{#snippet subTitle(text: string)}
  <h2 class="text-2xl font-bold lg:text-3xl">{text}</h2>
{/snippet}

<section class="mx-auto flex w-full flex-1 p-4 lg:w-[90%] xl:w-[80%]">
  <Form
    schema={articleSchema(_state.selectedLang as keyof typeof languages)}
    multiLang={true}
    multiLangKeys={MultiLangKeys}
    data={articleData as any}
    class="border-text flex w-full flex-col items-start gap-4 rounded-md border-2 p-4"
    action={editing ? '?/edit' : '?/create'}
    onAction={action}
  >
    <a href="/{_state.selectedLang}/admin/article">
      <Icon name="bi-chevron-left" />
      {_lang.back}
    </a>

    <div class="flex w-full items-center justify-between">
      <H1 class="mb-4">{editing ? _lang.editTitle : _lang.createTitle}</H1>

      <LanguageSelector />
    </div>
    <Card>
      {@render subTitle(_lang.details.title)}
      <Input
        name="title"
        label={_lang.details.titleInput}
        placeholder={_lang.details.titlePlaceholder}
        variant="small"
      />
      <GeminiInput
        name="description"
        label={_lang.details.description}
        placeholder={_lang.details.descriptionPlaceholder}
        variant="small"
        data={{
          title: currentArticleData?.title,
          content: currentArticleData?.content_md
        }}
        {sysPrompt}
      />
      {#if !showPreview}
        <TextArea
          name="content_md"
          label={_lang.details.content}
          rows={10}
          placeholder={_lang.details.contentPlaceholder}
        >
          {#snippet right()}
            <Icon
              class="mr-auto ml-2"
              name="bi-eye"
              onclick={() => (showPreview = true)}
            />
          {/snippet}
        </TextArea>
      {:else}
        <Markdown label={_lang.details.content} name="content_md">
          {#snippet right()}
            <Icon
              class="mr-auto ml-2"
              name="bi-pencil"
              onclick={() => (showPreview = false)}
            />
          {/snippet}
        </Markdown>
      {/if}
    </Card>
    <Card>
      {@render subTitle(_lang.target.title)}

      <FormSelect name="object_id" label={_lang.target.object}>
        <option value="">{_lang.target.none}</option>
        {#each data.objects as obj (obj.id)}
          <option value={obj.id}>
            {(dynamicTranslations as Record<string, Record<string, string>>)[
              _state.selectedLang
            ][obj.name as string]}
          </option>
        {/each}
      </FormSelect>

      <div
        class="border-text bg-background/50 mt-2 flex flex-col gap-2 rounded-md border p-3"
      >
        <h4 class="font-bold">{_lang.target.add}</h4>
        <div class="flex flex-col gap-2 md:flex-row">
          <div class="flex-1">
            <BaseInput
              type="text"
              placeholder={_lang.target.newCs}
              bind:value={newObjectCs}
            />
          </div>
          <div class="flex-1">
            <BaseInput
              type="text"
              placeholder={_lang.target.newEn}
              bind:value={newObjectEn}
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <BaseButton
              onclick={searchAstroDb}
              disabled={isResolving}
              class="flex min-w-[140px] items-center justify-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              {#if isResolving}
                <Icon name="bi-arrow-repeat" class="animate-spin" />
              {:else}
                <Icon name="bi-search" />
              {/if}
              {_lang.target.searchAstroDb}
            </BaseButton>
            <BaseButton
              onclick={addNewObject}
              class="bg-primary hover:bg-primary/95 whitespace-nowrap text-white"
            >
              {_lang.target.add}
            </BaseButton>
          </div>
        </div>
      </div>

      <DataProvider name="ra" bind:value={ra} />
      <DataProvider name="dec" bind:value={dec} />
      <DataProvider name="fov_width" bind:value={fovWidth} />
      <DataProvider name="fov_height" bind:value={fovHeight} />
      <DataProvider name="fov_rotation" bind:value={fovRotation} />

      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          name="ra"
          label={_lang.target.ra}
          type="number"
          step="any"
          placeholder="e.g. 83.82"
        />
        <Input
          name="dec"
          label={_lang.target.dec}
          type="number"
          step="any"
          placeholder="e.g. -5.39"
        />
      </div>

      <div class="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
        <h4 class="text-lg font-bold">{_lang.target.title}</h4>
        <BaseButton
          onclick={calculateFov}
          class="flex items-center gap-1 bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
        >
          <Icon name="bi-calculator" />
          {_lang.target.calculateFov}
        </BaseButton>
      </div>

      <div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          name="fov_width"
          label={_lang.target.width}
          type="number"
          step="any"
          placeholder="e.g. 1.5"
        />
        <Input
          name="fov_height"
          label={_lang.target.height}
          type="number"
          step="any"
          placeholder="e.g. 1.5"
        />
        <Input
          name="fov_rotation"
          label={_lang.target.rotation}
          type="number"
          step="any"
          placeholder="e.g. 45"
        />
      </div>
    </Card>
    <Card>
      {@render subTitle(_lang.equipment.title)}
      <Select bind:value={selectedEquipment}>
        <option value={null} selected disabled>{_lang.equipment.select}</option>
        {#each data.equipment.filter((item) => !equipment.includes(item.id)) as item (item.id)}
          <option value={item.id}>{item.name}</option>
        {/each}
      </Select>
      <DataProvider name="equipment" bind:value={equipment} />
      {#if equipment.length === 0}
        <h2 class="font-bold">{_lang.equipment.empty}</h2>
      {:else}
        <div class="flex flex-wrap gap-2">
          {#each data.equipment.filter( (item) => equipment.includes(item.id) ) as item (item.id)}
            <div class="border-text rounded-md border-2 px-2 py-1 font-bold">
              {item.name}
              <Icon
                onclick={() =>
                  (equipment = equipment.filter((_item) => _item !== item.id))}
                name="bi-trash-fill"
                class="cursor-pointer text-red-500"
              />
            </div>
          {/each}
        </div>
      {/if}
    </Card>
    <Card>
      {@render subTitle(_lang.images.title)}
      <ImageManager label={_lang.images.upload} />
    </Card>
    <Card>
      {@render subTitle(_lang.exposures.title)}
      <div class="flex gap-2">
        <FormItem for="date" label={_lang.exposures.date} variant="small">
          <DatePicker id="date" type="date" bind:value={exposureDate} />
        </FormItem>
        <FormItem for="type" label={_lang.exposures.type} variant="small">
          <Select id="type" bind:value={exposureType}>
            <option value="light">{_state.lang.frames.light}</option>
            <option value="dark">{_state.lang.frames.dark}</option>
            <option value="flat">{_state.lang.frames.flat}</option>
            <option value="bias">{_state.lang.frames.bias}</option>
          </Select>
        </FormItem>
        <FormItem
          class="flex-1"
          for="count"
          label={_lang.exposures.count}
          variant="small"
        >
          <BaseInput id="count" type="number" min={1} bind:value={exposureCount} />
        </FormItem>
        <FormItem
          class="flex-1"
          for="duration"
          label={_lang.exposures.seconds}
          variant="small"
        >
          <BaseInput id="duration" type="number" min={1} bind:value={exposureDuration} />
        </FormItem>
      </div>

      <BaseButton
        class="w-full"
        onclick={(ev) => {
          ev.preventDefault();
          addExposure();
        }}
      >
        {_lang.exposures.button}
      </BaseButton>

      <div class="border-text rounded-md border-2 text-center">
        <DataProvider name="exposures" bind:value={exposures} />
        <Table>
          <THead>
            <Tr>
              <Th>{_lang.exposures.date}</Th>
              <Th>{_lang.exposures.type}</Th>
              <Th>{_lang.exposures.count}</Th>
              <Th>{_lang.exposures.time}</Th>
              <Th>{_lang.exposures.total}</Th>
              <Th></Th>
            </Tr>
          </THead>
          <TBody>
            {#if exposures.length === 0}
              <Tr>
                <Th colspan={6}>{_lang.exposures.empty}</Th>
              </Tr>
            {:else}
              {#each exposures as exposure, idx (`${exposure.date.toISOString()}-${exposure.type}-${exposure.count}-${exposure.exposure_time_s}`)}
                <Tr>
                  <Td>{formatDate(exposure.date, false)}</Td>
                  <Td>{exposure.type}</Td>
                  <Td>{exposure.count}</Td>
                  <Td>{exposure.exposure_time_s}</Td>
                  <Td>{exposure.count * exposure.exposure_time_s}</Td>
                  <Td>
                    <Icon
                      onclick={() =>
                        (exposures = exposures.filter((_, _idx) => _idx !== idx))}
                      name="bi-trash-fill"
                      class="cursor-pointer text-2xl text-red-500"
                    />
                  </Td>
                </Tr>
              {/each}
            {/if}
          </TBody>
        </Table>
      </div>

      <div class="bg-divider flex items-center justify-between rounded-md p-4">
        {#each ['light', 'dark', 'flat', 'bias'] as const as type (type)}
          <div class="flex flex-col">
            <span class="text-xl font-medium lg:text-2xl"
              >{_state.lang.frames[type]} {_lang.exposures.frames}</span
            >
            <span class="text-2xl font-extrabold lg:text-3xl">
              {exposures
                .filter((ex) => ex.type === type)
                .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)}s
            </span>
          </div>
        {/each}
      </div>
    </Card>
    <div class="flex w-full justify-end gap-2">
      <BaseButton onclick={() => goto(`/${_state.selectedLang}/admin/article`)}>
        {_lang.cancel}
      </BaseButton>
      <Button type="submit" class="bg-primary">
        {editing ? _lang.save : _lang.create}
      </Button>
    </div>
  </Form>
</section>
