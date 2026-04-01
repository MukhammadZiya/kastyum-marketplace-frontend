import { useEffect, useState } from "react";

export type SelectOption = { label: string; value: string };

type Props = {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function CustomSelect({ options, value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption =
    options.find((o) => o.value === value) ?? options[0] ?? { label: "", value: "" };

  const toggleDropdown = () => setIsOpen((v) => !v);

  const handleOptionClick = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".dropdown-content")) setIsOpen(false);
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="dropdown-content relative" style={{ width: "200px" }}>
      <button
        type="button"
        className={`w-full whitespace-nowrap rounded-l-[5px] border border-neutral-200 bg-neutral-50 py-2.5 pl-4 pr-10 text-left ${
          isOpen ? "ring-1 ring-blue-600" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption.label}
      </button>

      <div
        className={`absolute left-0 top-full z-[70] mt-1 w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleOptionClick(option)}
            className={`block w-full px-4 py-2 text-left text-[14px] hover:bg-neutral-50 ${
              selectedOption.value === option.value
                ? "text-blue-600"
                : "text-neutral-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
