type Props = {
  view: "cards" | "table";
  onChange: (v: "cards" | "table") => void;
};

export default function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="flex justify-end">
      <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm border border-gray-200">
        <button
          className={[
            "px-4 py-1.5 text-sm font-semibold rounded-full transition",
            view === "cards"
              ? "bg-gray-900 text-white shadow"
              : "text-gray-700 hover:bg-white",
          ].join(" ")}
          onClick={() => onChange("cards")}
          type="button"
        >
          Cards
        </button>

        <button
          className={[
            "px-4 py-1.5 text-sm font-semibold rounded-full transition",
            view === "table"
              ? "bg-gray-900 text-white shadow"
              : "text-gray-700 hover:bg-white",
          ].join(" ")}
          onClick={() => onChange("table")}
          type="button"
        >
          Table
        </button>
      </div>
    </div>
  );
}