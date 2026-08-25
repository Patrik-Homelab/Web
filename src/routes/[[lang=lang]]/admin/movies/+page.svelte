<script lang="ts">
  import Button from '$/components/form/Button.svelte';
  import FormItem from '$/components/form/FormItem.svelte';
  import Input from '$/components/form/Input.svelte';
  import Select from '$/components/form/Select.svelte';
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
  import { formatDate, SwalAlert } from '$/lib/functions';
  import { replacePlaceholders, resolveError } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import type { Movie } from '$/types/database';
  import { invalidateAll } from '$app/navigation';
  import type { Selectable } from 'kysely';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  const _state = getState();
  const _lang = $derived(_state.lang.admin.movies);
  const _dynamicLang = $derived(data.dynamicTranslations);

  let openAddDialog = $state(false);
  let editingMovie = $state<Selectable<Movie> | null>(null);

  let formTitleCs = $state('');
  let formTitleEn = $state('');
  let formType = $state<'movie' | 'series'>('series');
  let formReleaseYear = $state(new Date().getFullYear());
  let formRating = $state(4.5);
  let formAddedAt = $state(new Date().toISOString().split('T')[0]);
  let formReviewCs = $state('');
  let formReviewEn = $state('');

  const resetForm = () => {
    formTitleCs = '';
    formTitleEn = '';
    formType = 'series';
    formReleaseYear = new Date().getFullYear();
    formRating = 4.5;
    formAddedAt = new Date().toISOString().split('T')[0];
    formReviewCs = '';
    formReviewEn = '';
  };

  const openAdd = () => {
    resetForm();
    openAddDialog = true;
  };

  const openEdit = (movie: Selectable<Movie>) => {
    editingMovie = movie;
    formTitleCs = _dynamicLang.cs[movie.title] || '';
    formTitleEn = _dynamicLang.en[movie.title] || '';
    formType = (movie.type as 'movie' | 'series') || 'series';
    formReleaseYear = movie.release_year;
    formRating = Number(movie.rating);
    formAddedAt = movie.added_at
      ? new Date(movie.added_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    formReviewCs = _dynamicLang.cs[movie.review] || '';
    formReviewEn = _dynamicLang.en[movie.review] || '';
  };

  const handleSaveAdd = async (e: SubmitEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('cs:title', formTitleCs);
    fd.append('en:title', formTitleEn || formTitleCs);
    fd.append('type', formType);
    fd.append('release_year', formReleaseYear.toString());
    fd.append('rating', formRating.toString());
    fd.append('added_at', formAddedAt);
    fd.append('cs:review', formReviewCs);
    fd.append('en:review', formReviewEn || formReviewCs);

    const res = await API.movies.POST(fd);

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
    if (!editingMovie) return;

    const fd = new FormData();
    fd.append('id', editingMovie.id.toString());
    fd.append('cs:title', formTitleCs);
    fd.append('en:title', formTitleEn || formTitleCs);
    fd.append('type', formType);
    fd.append('release_year', formReleaseYear.toString());
    fd.append('rating', formRating.toString());
    fd.append('added_at', formAddedAt);
    fd.append('cs:review', formReviewCs);
    fd.append('en:review', formReviewEn || formReviewCs);

    const res = await API.movies.PUT(fd);

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

    editingMovie = null;
    resetForm();
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

    const res = await API.movies.DELETE(id);
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

<section class="mx-auto flex w-full flex-1 p-4 pt-14 pb-6 md:pt-20 lg:w-[95%] xl:w-[85%]">
  <div class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
    <div class="flex w-full items-center justify-between">
      <H1 class="mb-4">{_lang.title}</H1>
      <Button onclick={openAdd}>{_lang.addTitle}</Button>
    </div>

    {#if data.movies.length === 0}
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
              <Th>{_lang.fields.type}</Th>
              <Th>{_lang.fields.titleCs}</Th>
              <Th>{_lang.fields.titleEn}</Th>
              <Th>{_lang.fields.releaseYear}</Th>
              <Th>{_lang.fields.rating}</Th>
              <Th>{_lang.fields.addedAt}</Th>
              <Th>{_lang.fields.reviewCs}</Th>
              <Th>Akce</Th>
            </Tr>
          </THead>
          <TBody>
            {#each data.movies as movie (movie.id)}
              <Tr>
                <Td class="font-bold">{movie.id}</Td>
                <Td>
                  <span
                    class="rounded px-2 py-0.5 text-xs font-bold uppercase {movie.type ===
                    'movie'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-indigo-500/20 text-indigo-300'}"
                  >
                    {movie.type === 'movie' ? _lang.fields.movie : _lang.fields.series}
                  </span>
                </Td>
                <Td class="font-semibold">{_dynamicLang.cs[movie.title] || '-'}</Td>
                <Td class="text-text-muted">{_dynamicLang.en[movie.title] || '-'}</Td>
                <Td>{movie.release_year}</Td>
                <Td class="font-bold text-amber-400">
                  <i class="bi bi-star-fill mr-1 text-xs"></i>{movie.rating}
                </Td>
                <Td class="font-mono text-xs">{formatDate(movie.added_at)}</Td>
                <Td
                  class="max-w-xs truncate text-xs"
                  title={_dynamicLang.cs[movie.review]}
                >
                  {_dynamicLang.cs[movie.review] || '-'}
                </Td>
                <Td>
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      onclick={() => openEdit(movie)}
                      class="cursor-pointer text-blue-400 hover:text-blue-300"
                      aria-label="Edit"
                    >
                      <Icon name="bi-pencil-fill" />
                    </button>
                    <button
                      type="button"
                      onclick={() => handleDelete(movie.id)}
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

<!-- ADD MOVIE DIALOG -->
<Dialog opened={openAddDialog} onClose={() => (openAddDialog = false)}>
  <H1 class="mb-4">{_lang.addTitle}</H1>
  <form onsubmit={handleSaveAdd} class="flex flex-col gap-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormItem for="titleCs" label={_lang.fields.titleCs}>
        <Input
          id="titleCs"
          name="cs:title"
          bind:value={formTitleCs}
          placeholder="např. Loki"
          required
        />
      </FormItem>
      <FormItem for="titleEn" label={_lang.fields.titleEn}>
        <Input
          id="titleEn"
          name="en:title"
          bind:value={formTitleEn}
          placeholder="e.g. Loki"
          required
        />
      </FormItem>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <FormItem for="type" label={_lang.fields.type}>
        <Select id="type" name="type" bind:value={formType} required>
          <option value="series">{_lang.fields.series}</option>
          <option value="movie">{_lang.fields.movie}</option>
        </Select>
      </FormItem>

      <FormItem for="year" label={_lang.fields.releaseYear}>
        <Input
          id="year"
          name="release_year"
          type="number"
          min={1900}
          max={2100}
          bind:value={formReleaseYear}
          required
        />
      </FormItem>

      <FormItem for="rating" label={_lang.fields.rating}>
        <Input
          id="rating"
          name="rating"
          type="number"
          min={0}
          max={5}
          bind:value={formRating}
          required
        />
      </FormItem>

      <FormItem for="added_at" label={_lang.fields.addedAt}>
        <input
          id="added_at"
          name="added_at"
          type="date"
          bind:value={formAddedAt}
          class="border-text text-text w-full rounded border bg-transparent p-2"
          required
        />
      </FormItem>
    </div>

    <FormItem for="reviewCs" label={_lang.fields.reviewCs}>
      <TextArea
        id="reviewCs"
        name="cs:review"
        bind:value={formReviewCs}
        placeholder="Tvoje recenze v češtině..."
        rows={3}
        required
      />
    </FormItem>

    <FormItem for="reviewEn" label={_lang.fields.reviewEn}>
      <TextArea
        id="reviewEn"
        name="en:review"
        bind:value={formReviewEn}
        placeholder="Your review in English..."
        rows={3}
        required
      />
    </FormItem>

    <div class="mt-2 flex justify-end gap-3">
      <Button type="button" onclick={() => (openAddDialog = false)}>
        {_state.lang.cancel}
      </Button>
      <Button type="submit">{_lang.fields.button}</Button>
    </div>
  </form>
</Dialog>

<!-- EDIT MOVIE DIALOG -->
<Dialog opened={editingMovie !== null} onClose={() => (editingMovie = null)}>
  {#if editingMovie}
    <H1 class="mb-4">
      {replacePlaceholders(_lang.editTitle.title, editingMovie.id.toString())}
    </H1>
    <form onsubmit={handleSaveEdit} class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormItem for="edit_titleCs" label={_lang.fields.titleCs}>
          <Input id="edit_titleCs" name="cs:title" bind:value={formTitleCs} required />
        </FormItem>
        <FormItem for="edit_titleEn" label={_lang.fields.titleEn}>
          <Input id="edit_titleEn" name="en:title" bind:value={formTitleEn} required />
        </FormItem>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <FormItem for="edit_type" label={_lang.fields.type}>
          <Select id="edit_type" name="type" bind:value={formType} required>
            <option value="series">{_lang.fields.series}</option>
            <option value="movie">{_lang.fields.movie}</option>
          </Select>
        </FormItem>

        <FormItem for="edit_year" label={_lang.fields.releaseYear}>
          <Input
            id="edit_year"
            name="release_year"
            type="number"
            min={1900}
            max={2100}
            bind:value={formReleaseYear}
            required
          />
        </FormItem>

        <FormItem for="edit_rating" label={_lang.fields.rating}>
          <Input
            id="edit_rating"
            name="rating"
            type="number"
            min={0}
            max={5}
            bind:value={formRating}
            required
          />
        </FormItem>

        <FormItem for="edit_added_at" label={_lang.fields.addedAt}>
          <input
            id="edit_added_at"
            name="added_at"
            type="date"
            bind:value={formAddedAt}
            class="border-text text-text w-full rounded border bg-transparent p-2"
            required
          />
        </FormItem>
      </div>

      <FormItem for="edit_reviewCs" label={_lang.fields.reviewCs}>
        <TextArea
          id="edit_reviewCs"
          name="cs:review"
          bind:value={formReviewCs}
          rows={3}
          required
        />
      </FormItem>

      <FormItem for="edit_reviewEn" label={_lang.fields.reviewEn}>
        <TextArea
          id="edit_reviewEn"
          name="en:review"
          bind:value={formReviewEn}
          rows={3}
          required
        />
      </FormItem>

      <div class="mt-2 flex justify-end gap-3">
        <Button type="button" onclick={() => (editingMovie = null)}>
          {_state.lang.cancel}
        </Button>
        <Button type="submit">{_lang.editTitle.button}</Button>
      </div>
    </form>
  {/if}
</Dialog>
