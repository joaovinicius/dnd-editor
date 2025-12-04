export function FailureMessage() {
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-cancel shrink-0 h-12 w-12 text-white"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M18.364 5.636l-12.728 12.728"></path></svg>`;

  return (
    <div className="my-4 flex flex-col items-center justify-center gap-8 rounded-2xl bg-white px-4 py-8 sm:px-8 md:px-10 md:py-10">
      <div
        className="flex h-12.5 w-12.5 items-center justify-center rounded-full bg-[#ebb91e] p-8"
        dangerouslySetInnerHTML={{ __html: icon }}
      ></div>

      <p className="text-center text-xl">
        <strong>
          Thanks for reaching out! It looks like we already have a claim on file
          for you.
        </strong>
      </p>

      <p>
        If you’d like to check your claim status or share any new information,
        give us a call at (844) 820-3040.
      </p>
      <p>
        Our team is here to help and make sure everything is moving forward for
        you.
      </p>
    </div>
  );
}
