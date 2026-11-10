<script lang="ts">
  import Button from '$/components/form/Button.svelte';
  import FormItem from '$/components/form/FormItem.svelte';
  import Input from '$/components/form/Input.svelte';
  import TextArea from '$/components/form/TextArea.svelte';
  import H1 from '$/components/headers/H1.svelte';
  import Table from '$/components/table/Table.svelte';
  import TBody from '$/components/table/TBody.svelte';
  import Td from '$/components/table/Td.svelte';
  import Th from '$/components/table/Th.svelte';
  import THead from '$/components/table/THead.svelte';
  import Tr from '$/components/table/Tr.svelte';
  import Dialog from '$/components/utility/Dialog.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import { API } from '$/lib/api';
  import { resolveProjectImageUrl, TAG_STYLES } from '$/lib/data/projectsData';
  import { formatDate, SwalAlert } from '$/lib/functions';
  import { replacePlaceholders, resolveError } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import type { Project } from '$/types/database';
  import { invalidateAll } from '$app/navigation';
  import type { Selectable } from 'kysely';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  const _state = getState();
  const _lang = $derived(_state.lang.admin.projects);
  const _dynamicLang = $derived(data.dynamicTranslations);

  const presetTags = Object.keys(TAG_STYLES);

  let openAddDialog = $state(false);
  let editingProject = $state<Selectable<Project> | null>(null);

  let formNameCs = $state('');
  let formNameEn = $state('');
  let formDate = $state(new Date().toISOString().split('T')[0]);
  let formTags = $state('');
  let formPreview = $state('');
  let formImages = $state<string[]>([]);
  let formDescCs = $state('');
  let formDescEn = $state('');
  let formHidden = $state(false);

  let previewFileInput = $state<HTMLInputElement | undefined>(undefined);
  let galleryFileInput = $state<HTMLInputElement | undefined>(undefined);

  function parseJsonArray(raw: string | null | undefined): string[] {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fallback
    }
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const resetForm = () => {
    formNameCs = '';
    formNameEn = '';
    formDate = new Date().toISOString().split('T')[0];
    formTags = '';
    formPreview = '';
    formImages = [];
    formDescCs = '';
    formDescEn = '';
    formHidden = false;
  };

  const openAdd = () => {
    resetForm();
    openAddDialog = true;
  };

  const openEdit = (project: Selectable<Project>) => {
    editingProject = project;
    formNameCs = _dynamicLang.cs[project.name] || '';
    formNameEn = _dynamicLang.en[project.name] || '';
    formDate = project.date
      ? new Date(project.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    formTags = parseJsonArray(project.tags).join(', ');
    formPreview = project.preview || '';
    formImages = parseJsonArray(project.images);
    formDescCs = _dynamicLang.cs[project.description] || '';
    formDescEn = _dynamicLang.en[project.description] || '';
    formHidden = Boolean(project.hidden);
  };

  const togglePresetTag = (tag: string) => {
    const current = formTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (current.includes(tag)) {
      formTags = current.filter((t) => t !== tag).join(', ');
    } else {
      formTags = [...current, tag].join(', ');
    }
  };

  const handleUploadPreview = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.set('file', file);
    const res = await API.upload.POST(fd);
    if (res.status) {
      formPreview = res.data;
    } else {
      SwalAlert({
        title: resolveError(res.message, _state.lang),
        icon: 'error'
      });
    }
    target.value = '';
  };

  const handleUploadGallery = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      const fd = new FormData();
      fd.set('file', file);
      const res = await API.upload.POST(fd);
      if (res.status) {
        formImages = [...formImages, res.data];
      } else {
        SwalAlert({
          title: resolveError(res.message, _state.lang),
          icon: 'error'
        });
      }
    }
    target.value = '';
  };

  const removeGalleryImage = (idx: number) => {
    formImages = formImages.filter((_, i) => i !== idx);
  };

  const handleSaveAdd = async (e: SubmitEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('cs:name', formNameCs);
    fd.append('en:name', formNameEn || formNameCs);
    fd.append('date', formDate);
    fd.append('tags', formTags);
    fd.append('preview', formPreview);
    fd.append('images', JSON.stringify(formImages));
    fd.append('cs:description', formDescCs);
    fd.append('en:description', formDescEn || formDescCs);
    fd.append('hidden', formHidden ? '1' : '0');

    const res = await API.projects.POST(fd);

    if (!res.status) {
      SwalAlert({
        title: resolveError(res.message, _state.lang),
        icon: 'error'
      });
      return;
    }

    SwalAlert({
      title: _lang.success,
      icon: 'success'
    });

    openAddDialog = false;
    resetForm();
    invalidateAll();
  };

  const handleSaveEdit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const fd = new FormData();
    fd.append('id', editingProject.id.toString());
    fd.append('cs:name', formNameCs);
    fd.append('en:name', formNameEn || formNameCs);
    fd.append('date', formDate);
    fd.append('tags', formTags);
    fd.append('preview', formPreview);
    fd.append('images', JSON.stringify(formImages));
    fd.append('cs:description', formDescCs);
    fd.append('en:description', formDescEn || formDescCs);
    fd.append('hidden', formHidden ? '1' : '0');

    const res = await API.projects.PUT(fd);

    if (!res.status) {
      SwalAlert({
        title: resolveError(res.message, _state.lang),
        icon: 'error'
      });
      return;
    }

    SwalAlert({
      title: _lang.editSuccess,
      icon: 'success'
    });

    editingProject = null;
    resetForm();
    invalidateAll();
  };

  const toggleVisibility = async (id: number) => {
    const res = await API.projects.toggle({ id });
    if (!res.status) {
      SwalAlert({
        title: resolveError(res.message, _state.lang),
        icon: 'error'
      });
      return;
    }
    invalidateAll();
  };

  const setAllVisibility = async (hidden: boolean) => {
    const res = await API.projects.visibilityAll({ hidden });
    if (!res.status) {
      SwalAlert({
        title: resolveError(res.message, _state.lang),
        icon: 'error'
      });
      return;
    }
    invalidateAll();
  };

  const handleDelete = async (id: number) => {
    const result = await SwalAlert({
      timer: 0,
      toast: false,
      position: 'center',
      title: _lang.delete.question,
      showConfirmButton: true,
      confirmButtonText: _state.lang.yes,
      showCancelButton: true,
      cancelButtonText: _state.lang.no
    });

    if (!result.isConfirmed) return;

    const res = await API.projects.DELETE(id);
    if (!res.status) {
      SwalAlert({
        title: resolveError(res.message, _state.lang),
        icon: 'error'
      });
      return;
    }

    SwalAlert({
      title: _lang.deleteSuccess,
      icon: 'success'
    });

    invalidateAll();
  };
</script>

{#snippet projectFormFields(prefix: string)}
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <FormItem for="{prefix}_nameCs" label={_lang.fields.nameCs}>
      <Input
        id="{prefix}_nameCs"
        name="cs:name"
        bind:value={formNameCs}
        placeholder="např. Moje stránky"
        required
      />
    </FormItem>
    <FormItem for="{prefix}_nameEn" label={_lang.fields.nameEn}>
      <Input
        id="{prefix}_nameEn"
        name="en:name"
        bind:value={formNameEn}
        placeholder="e.g. My Personal Website"
        required
      />
    </FormItem>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <FormItem for="{prefix}_date" label={_lang.fields.date}>
      <input
        id="{prefix}_date"
        name="date"
        type="date"
        bind:value={formDate}
        class="border-text text-text w-full rounded border bg-transparent p-2"
        required
      />
    </FormItem>

    <div class="md:col-span-2">
      <FormItem for="{prefix}_tags" label={_lang.fields.tags}>
        <Input
          id="{prefix}_tags"
          name="tags"
          bind:value={formTags}
          placeholder={_lang.fields.tagsPlaceholder}
        />
      </FormItem>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {#each presetTags as tag (tag)}
          {@const active = formTags
            .split(',')
            .map((t) => t.trim())
            .includes(tag)}
          <button
            type="button"
            onclick={() => togglePresetTag(tag)}
            class="cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all {active
              ? 'bg-primary border-primary text-slate-950'
              : 'text-text-muted border-white/15 bg-white/5 hover:bg-white/10'}"
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Preview & Gallery Images -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <FormItem for="{prefix}_preview" label={_lang.fields.preview}>
      <div class="flex gap-2">
        <Input
          id="{prefix}_preview"
          name="preview"
          bind:value={formPreview}
          placeholder="/projects/... or uploaded filename"
        />
        <input
          type="file"
          accept="image/*"
          class="hidden"
          bind:this={previewFileInput}
          onchange={handleUploadPreview}
        />
        <Button type="button" onclick={() => previewFileInput?.click()}>
          {_lang.fields.uploadPreview}
        </Button>
      </div>
      {#if formPreview}
        {@const resolvedPreview = resolveProjectImageUrl(formPreview)}
        {#if resolvedPreview}
          <div class="mt-2 flex items-center gap-3">
            <img
              src={resolvedPreview}
              alt="Preview"
              class="h-14 w-24 rounded border border-white/15 object-cover"
            />
            <button
              type="button"
              onclick={() => (formPreview = '')}
              class="cursor-pointer text-xs text-red-400 hover:underline"
            >
              Remove
            </button>
          </div>
        {/if}
      {/if}
    </FormItem>

    <FormItem for="{prefix}_images" label={_lang.fields.images}>
      <div class="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          bind:this={galleryFileInput}
          onchange={handleUploadGallery}
        />
        <Button type="button" onclick={() => galleryFileInput?.click()}>
          {_lang.fields.uploadImages} ({formImages.length})
        </Button>
      </div>
      {#if formImages.length > 0}
        <div class="mt-2 flex max-h-28 flex-wrap gap-2 overflow-y-auto p-1">
          {#each formImages as img, idx (idx)}
            {@const resolvedImg = resolveProjectImageUrl(img)}
            <div
              class="relative flex items-center gap-1.5 rounded border border-white/15 bg-black/40 p-1 pr-2 text-xs"
            >
              {#if resolvedImg}
                <img src={resolvedImg} alt="" class="h-8 w-12 rounded object-cover" />
              {/if}
              <span class="max-w-[100px] truncate">{img}</span>
              <button
                type="button"
                onclick={() => removeGalleryImage(idx)}
                class="cursor-pointer text-red-400 hover:text-red-300"
                aria-label="Remove image"
              >
                <Icon name="bi-x-lg" />
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </FormItem>
  </div>

  <FormItem for="{prefix}_descCs" label={_lang.fields.descriptionCs}>
    <TextArea
      id="{prefix}_descCs"
      name="cs:description"
      bind:value={formDescCs}
      rows={4}
      required
    />
  </FormItem>

  <FormItem for="{prefix}_descEn" label={_lang.fields.descriptionEn}>
    <TextArea
      id="{prefix}_descEn"
      name="en:description"
      bind:value={formDescEn}
      rows={4}
      required
    />
  </FormItem>

  <div class="flex items-center gap-2 pt-1">
    <input
      id="{prefix}_hidden"
      name="hidden"
      type="checkbox"
      bind:checked={formHidden}
      class="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-white/20 bg-black/40"
    />
    <label
      for="{prefix}_hidden"
      class="text-text cursor-pointer text-sm font-medium select-none"
    >
      {_lang.fields.hidden}
    </label>
  </div>
{/snippet}

<section class="mx-auto flex w-full flex-1 p-4 pt-14 pb-6 md:pt-20 lg:w-[95%] xl:w-[85%]">
  <div class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
    <div class="mb-4 flex w-full flex-wrap items-center justify-between gap-3">
      <H1>{_lang.title}</H1>
      <div class="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onclick={() => setAllVisibility(false)}
          class="!border-emerald-500/40 !bg-emerald-600/20 text-xs text-emerald-300 hover:!bg-emerald-600/30"
        >
          <Icon name="bi-eye-fill" class="mr-1" />
          {_lang.showAll}
        </Button>
        <Button
          type="button"
          onclick={() => setAllVisibility(true)}
          class="!border-amber-500/40 !bg-amber-600/20 text-xs text-amber-300 hover:!bg-amber-600/30"
        >
          <Icon name="bi-eye-slash-fill" class="mr-1" />
          {_lang.hideAll}
        </Button>
        <Button onclick={openAdd}>{_lang.addTitle}</Button>
      </div>
    </div>

    {#if data.projects.length === 0}
      <span class="font-poppins m-auto py-12 text-2xl font-bold lg:text-3xl">
        <Icon name="bi-ban-fill" class="text-red-500" />
        {_lang.empty}
      </span>
    {:else}
      <div class="border-text w-full overflow-x-auto rounded-md border-2">
        <Table>
          <THead>
            <Tr>
              <Th>ID</Th>
              <Th>{_lang.fields.preview}</Th>
              <Th>{_lang.status}</Th>
              <Th>{_lang.fields.nameCs}</Th>
              <Th>{_lang.fields.nameEn}</Th>
              <Th>{_lang.fields.date}</Th>
              <Th>{_lang.fields.tags}</Th>
              <Th>{_lang.fields.images}</Th>
              <Th>Akce</Th>
            </Tr>
          </THead>
          <TBody>
            {#each data.projects as project (project.id)}
              {@const previewUrl = resolveProjectImageUrl(project.preview)}
              {@const tagsList = parseJsonArray(project.tags)}
              {@const imagesList = parseJsonArray(project.images)}
              <Tr>
                <Td class="font-bold">{project.id}</Td>
                <Td>
                  {#if previewUrl}
                    <img
                      src={previewUrl}
                      alt=""
                      class="mx-auto h-10 w-16 rounded object-cover"
                    />
                  {:else}
                    <span class="text-text-muted text-xs">—</span>
                  {/if}
                </Td>
                <Td>
                  {#if project.hidden}
                    <span
                      class="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300"
                    >
                      <Icon name="bi-eye-slash-fill" class="text-[10px]" />
                      {_lang.hidden}
                    </span>
                  {:else}
                    <span
                      class="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400"
                    >
                      <Icon name="bi-eye-fill" class="text-[10px]" />
                      {_lang.visible}
                    </span>
                  {/if}
                </Td>
                <Td class="font-semibold">{_dynamicLang.cs[project.name] || '-'}</Td>
                <Td class="text-text-muted">{_dynamicLang.en[project.name] || '-'}</Td>
                <Td class="font-mono text-xs">{formatDate(project.date)}</Td>
                <Td>
                  <div class="flex flex-wrap justify-center gap-1">
                    {#each tagsList as tag (tag)}
                      <span class="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold">
                        {tag}
                      </span>
                    {/each}
                  </div>
                </Td>
                <Td class="font-mono text-xs">{imagesList.length}</Td>
                <Td>
                  <div class="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onclick={() => toggleVisibility(project.id)}
                      class="cursor-pointer transition-colors {project.hidden
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-emerald-400 hover:text-emerald-300'}"
                      title={_lang.toggleVisibility}
                      aria-label={_lang.toggleVisibility}
                    >
                      <Icon name={project.hidden ? 'bi-eye-slash-fill' : 'bi-eye-fill'} />
                    </button>
                    <button
                      type="button"
                      onclick={() => openEdit(project)}
                      class="cursor-pointer text-blue-400 hover:text-blue-300"
                      aria-label="Edit"
                    >
                      <Icon name="bi-pencil-fill" />
                    </button>
                    <button
                      type="button"
                      onclick={() => handleDelete(project.id)}
                      class="cursor-pointer text-red-500 hover:text-red-400"
                      aria-label="Delete"
                    >
                      <Icon name="bi-trash-fill" />
                    </button>
                  </div>
                </Td>
              </Tr>
            {/each}
          </TBody>
        </Table>
      </div>
    {/if}
  </div>
</section>

<!-- ADD PROJECT DIALOG -->
<Dialog opened={openAddDialog} onClose={() => (openAddDialog = false)}>
  <div class="max-h-[85vh] w-full max-w-3xl overflow-y-auto p-1">
    <H1 class="mb-4">{_lang.addTitle}</H1>
    <form onsubmit={handleSaveAdd} class="flex flex-col gap-4">
      {@render projectFormFields('add')}

      <div class="mt-2 flex justify-end gap-3">
        <Button type="button" onclick={() => (openAddDialog = false)}>
          {_state.lang.cancel}
        </Button>
        <Button type="submit">{_lang.fields.button}</Button>
      </div>
    </form>
  </div>
</Dialog>

<!-- EDIT PROJECT DIALOG -->
<Dialog opened={editingProject !== null} onClose={() => (editingProject = null)}>
  {#if editingProject}
    <div class="max-h-[85vh] w-full max-w-3xl overflow-y-auto p-1">
      <H1 class="mb-4">
        {replacePlaceholders(_lang.editTitle.title, editingProject.id.toString())}
      </H1>
      <form onsubmit={handleSaveEdit} class="flex flex-col gap-4">
        {@render projectFormFields('edit')}

        <div class="mt-2 flex justify-end gap-3">
          <Button type="button" onclick={() => (editingProject = null)}>
            {_state.lang.cancel}
          </Button>
          <Button type="submit">{_lang.editTitle.button}</Button>
        </div>
      </form>
    </div>
  {/if}
</Dialog>
