export default function PdpoStatement() {
  return (
    <section id="pdpo" aria-labelledby="pdpo-heading" className="rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h2 id="pdpo-heading" className="text-xl font-bold text-ink">
        Personal Information Collection Statement (Demo)
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
        <p>
          <strong>Purpose:</strong> The information on this page is used only to check your
          profile against the published criteria of scholarships shown in ScholarReady and to
          organise your application checklist.
        </p>
        <p>
          <strong>Voluntary:</strong> Providing this information is voluntary. If you leave a
          field blank, criteria that depend on it will show &quot;Check&quot;.
        </p>
        <p>
          <strong>Storage:</strong> In this demo, your information is stored only in this browser
          on this device. It is not sent to ScholarReady, any university or any scholarship
          provider.
        </p>
        <p>
          <strong>Transfer:</strong> Your information is not transferred to any third party.
        </p>
        <p>
          <strong>Access and correction:</strong> You may view and correct your information on
          this page at any time, and delete it by selecting &quot;Reset demo data&quot;.
        </p>
        <p>
          <strong>Demo notice:</strong> This is a demonstration using fictional data. Please do
          not enter real personal identifiers such as your HKID number.
        </p>
      </div>
    </section>
  )
}
