import { useEffect, useState } from "react";

type Option = { label: string; value: string };

export default function CustomSelect({ options }: { options: Option[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]!);

  const toggleDropdown = () => setIsOpen((v) => !v);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
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
        className={`whitespace-nowrap rounded-l-[5px] bg-neutral-50 border border-neutral-200 py-2.5 pl-4 pr-10 text-left w-full ${
          isOpen ? "ring-1 ring-blue-600" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption.label}
      </button>

      <div
        className={`absolute left-0 top-full z-[70] mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg overflow-hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options.slice(1).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleOptionClick(option)}
            className={`block w-full text-left px-4 py-2 text-[14px] hover:bg-neutral-50 ${
              selectedOption.value === option.value ? "text-blue-600" : "text-neutral-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

