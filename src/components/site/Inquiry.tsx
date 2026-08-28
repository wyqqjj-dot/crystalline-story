import { useState } from "react";
import { Barcode } from "./Barcode";

export function Inquiry() {
  const [sent, setSent] = useState(false);

  return (
    <section id="inquiry" className="border-b-2 border-foreground px-5 py-28 md:px-12 md:py-40">
      <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
        <span>Order form</span>
        <span>Min. order 5,000 pcs</span>
      </div>

      <h2 className="font-display mt-12 text-[17vw] leading-[0.78] tracking-tighter uppercase md:text-[10vw]">
        Request
        <span className="block text-accent">a quote</span>
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-20 grid gap-10 md:mt-28 md:grid-cols-2 md:gap-14"
      >
        <Field label="Name / Company" name="name" />
        <Field label="Email" name="email" type="email" />
        <Field label="Product reference" name="ref" placeholder="CQ-29 / CQ-174 / CQ-B-39" />
        <Field label="Quantity" name="qty" placeholder="10,000 pcs" />
        <div className="md:col-span-2">
          <Field label="Specification notes" name="notes" textarea />
        </div>
        <div className="md:col-span-2 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            className="font-display hover-invert border-2 border-foreground px-10 py-6 text-[9vw] leading-none tracking-tighter uppercase md:text-[3.4vw]"
          >
            {sent ? "Received" : "Submit inquiry"}
          </button>
          <p className="font-mono max-w-[36ch] text-[10px] leading-loose tracking-[0.35em] text-muted-foreground uppercase">
            {sent
              ? "Thank you. Our export team replies within one working day."
              : "Warning: handle with care — fragile goods. Samples shipped worldwide."}
          </p>
        </div>
      </form>

      <Barcode className="mt-24" label="CQ 537 2366968" />
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  const base =
    "font-mono w-full border-b-2 border-foreground/30 bg-transparent py-5 text-base tracking-[0.15em] uppercase text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none";
  return (
    <label className="block">
      <span className="font-mono block text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} rows={4} placeholder={placeholder} className={base} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} className={base} />
      )}
    </label>
  );
}
