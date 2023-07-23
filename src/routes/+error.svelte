<script>
  import { page } from "$app/stores"

</script>

<div class="min-h-screen hero bg-base-200">
	<div class="flex-col hero-content lg:flex-row">
		<img src="/assets/404.jpg" class="max-w-xs rounded-lg shadow-2xl lg:max-w-sm" alt="404" />
		<div>
			<h1 class="text-5xl font-bold">{$page.status}</h1>
			<p class="py-6">{$page.error?.message}</p>
		</div>
	</div>
</div>