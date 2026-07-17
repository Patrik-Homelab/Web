<script lang="ts">
  import Button from '$/components/form/Button.svelte';
  import H1 from '$/components/headers/H1.svelte';
  import Form, { type FormAction } from '$/components/newForm/Form.svelte';
  import Input from '$/components/newForm/Input.svelte';
  import { compareErrors, resolveError } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import { z } from 'zod';
  import type { SubmitFunction } from './$types';

  const _state = getState();

  const schema = z.object({
    username: z.string(),
    password: z.string()
  });

  const enhance = (({ result, update }) => {
    if (result.type === 'failure') {
      const message = result.data!.message;
      if (compareErrors(message, 'login.form')) {
        return {
          username: resolveError(message, _state.lang),
          password: resolveError(message, _state.lang)
        };
      } else if (compareErrors(message, 'login.username')) {
        return {
          username: resolveError(message, _state.lang)
        };
      } else if (compareErrors(message, 'login.password')) {
        return {
          password: resolveError(message, _state.lang)
        };
      }
    }

    update();
  }) satisfies FormAction<SubmitFunction, typeof schema, false>;
</script>

<div class="m-auto flex w-full max-w-md flex-col justify-center px-4 py-8">
  <!-- Glassmorphic Login Card -->
  <div
    class="flex flex-col gap-6 rounded-2xl border border-white/5 bg-slate-950/40 p-8 shadow-2xl backdrop-blur-md"
  >
    <Form
      {schema}
      data={{ username: '', password: '' }}
      class="flex w-full flex-col gap-4"
      onAction={enhance}
    >
      <H1 class="mx-auto mb-2 text-center font-bold">{_state.lang.admin.login.title}</H1>

      <div class="flex flex-col gap-3">
        <Input label={_state.lang.admin.login.username} name="username" />
        <Input label={_state.lang.admin.login.password} name="password" type="password" />
      </div>

      <Button
        class="bg-primary hover:bg-primary-600 mx-auto mt-4 cursor-pointer rounded-full px-6 py-2 font-bold text-slate-950 shadow-lg transition-colors"
        type="submit"
      >
        {_state.lang.admin.login.submit}
      </Button>
    </Form>
  </div>
</div>
