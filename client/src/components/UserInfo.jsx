export default function UserInfo({ userName, setUserName, onBack, onContinue }) {
  const cleaned = userName.trim();
  const tooLong = cleaned.length > 24;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-[min(720px,92vw)] rounded-3xl border bg-white/70 p-10 shadow-sm">
        <div className="text-sm tracking-[0.35em] text-neutral-600">BEFORE WE START</div>
        <h1 className="mt-4 text-3xl font-black">What’s your name?</h1>
        <p className="mt-2 text-neutral-600">(Optional)</p>

        <input
          className={`mt-6 w-full rounded-2xl border px-4 py-3 text-lg outline-none ${
            tooLong ? "border-red-400" : "border-neutral-200"
          }`}
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          maxLength={60}
        />

        <div className="mt-2 flex justify-between text-sm">
          <span className={tooLong ? "text-red-500" : "text-neutral-500"}>
            {tooLong ? "Keep it under 24 characters." : " "}
          </span>
          <span className="text-neutral-400">{cleaned.length}/24</span>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            className="flex-1 rounded-2xl border border-neutral-200 py-3 font-semibold"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className={`flex-1 rounded-2xl py-3 font-semibold text-white ${
              tooLong ? "bg-neutral-300 cursor-not-allowed" : "bg-neutral-700"
            }`}
            disabled={tooLong}
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}