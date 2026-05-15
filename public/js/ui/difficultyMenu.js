export class DifficultyMenu {
  constructor({ trigger, menu, valueLabel, options }) {
    this.trigger = trigger;
    this.menu = menu;
    this.valueLabel = valueLabel;
    this.options = options;
    this.onChange = null;
  }

  init({ onChange }) {
    this.onChange = onChange;

    this.trigger.addEventListener("click", () => {
      if (this.trigger.disabled) {
        return;
      }

      this.setOpen(this.menu.hidden);
    });

    this.options.forEach((option) => {
      option.addEventListener("click", () => {
        if (this.trigger.disabled) {
          return;
        }

        this.setValue(option.dataset.difficulty);
        this.setOpen(false);

        if (this.onChange) {
          this.onChange(option.dataset.difficulty);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!this.menu.hidden && !event.target.closest(".difficulty-row")) {
        this.setOpen(false);
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.setOpen(false);
      }
    });
  }

  getValue() {
    return this.valueLabel.textContent;
  }

  setValue(value) {
    this.valueLabel.textContent = value;
    this.options.forEach((option) => {
      const isSelected = option.dataset.difficulty === value;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
    });
  }

  setLocked(isLocked) {
    this.trigger.disabled = isLocked;
    this.trigger.classList.toggle("is-locked", isLocked);

    if (isLocked) {
      this.setOpen(false);
    }
  }

  setOpen(isOpen) {
    const shouldOpen = Boolean(isOpen && !this.trigger.disabled);
    this.menu.hidden = !shouldOpen;
    this.trigger.setAttribute("aria-expanded", String(shouldOpen));
    this.trigger.classList.toggle("is-open", shouldOpen);
  }
}
