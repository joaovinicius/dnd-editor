export function SuccessMessage() {
  const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-cancel shrink-0 h-12 w-12 text-white"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>`;

  return (
    <div className="my-4 flex flex-col items-center justify-center gap-8 rounded-2xl bg-white px-4 py-8 sm:px-8 md:px-10 md:py-10">
      <div
        className="flex h-12.5 w-12.5 items-center justify-center rounded-full bg-[#28a745] p-8"
        dangerouslySetInnerHTML={{ __html: icon }}
      ></div>

      <p className="text-center text-xl">
        <strong>YOUR EVALUATION HAS BEEN ACCEPTED.</strong>
      </p>

      <p>
        Thank you! Your information has been submitted successfully. Our team
        will review your case and reach out soon.
      </p>
    </div>
  );
}
