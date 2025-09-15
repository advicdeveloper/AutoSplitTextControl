import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class AutoSplitTextControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _context: ComponentFramework.Context<IInputs>;
    private _container: HTMLDivElement;
    private _field1Input: HTMLTextAreaElement;
    private _field2Input: HTMLTextAreaElement;
    private _field1Counter: HTMLSpanElement;
    private _field2Counter: HTMLSpanElement;
    private _field1Value: string;
    private _field2Value: string;
    private _field1MaxLength: number;
    private _field2MaxLength = 4000; // Removed : number to fix ESLint error
    private _notifyOutputChanged: () => void;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        // Get maxLength for field1, default to 4000 if invalid, cap at 4000
        const maxLengthRaw = context.parameters.maxLength?.raw;
        this._field1MaxLength = (maxLengthRaw && !isNaN(maxLengthRaw) && maxLengthRaw > 0)
            ? Math.min(maxLengthRaw, 4000)
            : 4000;

        console.log("init maxLength:", this._field1MaxLength);

        // Create wrapper for field1
        const field1Wrapper = document.createElement("div");
        field1Wrapper.className = "input-wrapper";

        // Create label for field1
        const field1Label = document.createElement("label");
        field1Label.textContent = "Primary Text";
        field1Label.htmlFor = "field1-input";
        field1Label.className = "input-label";

        // Create input for field1
        this._field1Input = document.createElement("textarea");
        this._field1Input.id = "field1-input";
        this._field1Input.className = "text-input";
        this._field1Input.value = (context.parameters.field1.raw || "").substring(0, this._field1MaxLength);
        this._field1Input.maxLength = this._field1MaxLength;
        this._field1Input.addEventListener("input", this.onInput.bind(this));
        this._field1Input.placeholder = `Enter text (max ${this._field1MaxLength} characters)`;

        // Create counter for field1
        this._field1Counter = document.createElement("span");
        this._field1Counter.className = "char-counter";
        this._field1Counter.textContent = `${this._field1Input.value.length}/${this._field1MaxLength}`;

        // Append label, input, and counter to field1 wrapper
        field1Wrapper.appendChild(field1Label);
        field1Wrapper.appendChild(this._field1Input);
        field1Wrapper.appendChild(this._field1Counter);

        // Create wrapper for field2
        const field2Wrapper = document.createElement("div");
        field2Wrapper.className = "input-wrapper";

        // Create label for field2
        const field2Label = document.createElement("label");
        field2Label.textContent = "Overflow Text";
        field2Label.htmlFor = "field2-input";
        field2Label.className = "input-label";

        // Create input for field2
        this._field2Input = document.createElement("textarea");
        this._field2Input.id = "field2-input";
        this._field2Input.className = "text-input";
        this._field2Input.value = (context.parameters.field2.raw || "").substring(0, this._field2MaxLength);
        this._field2Input.maxLength = this._field2MaxLength;
        this._field2Input.addEventListener("input", this.onInput.bind(this));
        this._field2Input.placeholder = `Overflow text (max ${this._field2MaxLength} characters)`;

        // Create counter for field2
        this._field2Counter = document.createElement("span");
        this._field2Counter.className = "char-counter";
        this._field2Counter.textContent = `${this._field2Input.value.length}/${this._field2MaxLength}`;

        // Append label, input, and counter to field2 wrapper
        field2Wrapper.appendChild(field2Label);
        field2Wrapper.appendChild(this._field2Input);
        field2Wrapper.appendChild(this._field2Counter);

        // Append wrappers to container
        this._container.appendChild(field1Wrapper);
        this._container.appendChild(field2Wrapper);

        // Initialize values
        this._field1Value = this._field1Input.value;
        this._field2Value = this._field2Input.value;
    }

    private onInput(): void {
        const field1Length = this._field1Input.value.length;

        if (field1Length >= this._field1MaxLength) {
            this._field1Input.classList.add("text-input--limit-reached");
            const excessText = this._field1Input.value.substring(this._field1MaxLength);
            this._field1Input.value = this._field1Input.value.substring(0, this._field1MaxLength);
            this._field2Input.value = (excessText + this._field2Input.value).substring(0, this._field2MaxLength);
            this._field2Input.focus();
        } else {
            this._field1Input.classList.remove("text-input--limit-reached");
        }

        this._field1Value = this._field1Input.value.substring(0, this._field1MaxLength);
        this._field2Value = this._field2Input.value.substring(0, this._field2MaxLength);
        this._field1Counter.textContent = `${this._field1Input.value.length}/${this._field1MaxLength}`;
        this._field2Counter.textContent = `${this._field2Input.value.length}/${this._field2MaxLength}`;
        this._notifyOutputChanged();

        console.log("onInput:", { field1: this._field1Value.length, field2: this._field2Value.length });
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const maxLengthRaw = context.parameters.maxLength?.raw;
        const newMaxLength = (maxLengthRaw && !isNaN(maxLengthRaw) && maxLengthRaw > 0)
            ? Math.min(maxLengthRaw, 4000)
            : 4000;

        if (newMaxLength !== this._field1MaxLength) {
            this._field1MaxLength = newMaxLength;
            this._field1Input.maxLength = this._field1MaxLength;
            this._field1Input.placeholder = `Enter text (max ${this._field1MaxLength} characters)`;
            this._field1Input.value = this._field1Input.value.substring(0, this._field1MaxLength);
            this._field1Counter.textContent = `${this._field1Input.value.length}/${this._field1MaxLength}`;
            console.log("updateView maxLength:", this._field1MaxLength);
        }

        if (this._field1Value !== context.parameters.field1.raw) {
            this._field1Input.value = (context.parameters.field1.raw || "").substring(0, this._field1MaxLength);
            this._field1Value = this._field1Input.value;
        }
        if (this._field2Value !== context.parameters.field2.raw) {
            this._field2Input.value = (context.parameters.field2.raw || "").substring(0, this._field2MaxLength);
            this._field2Value = this._field2Input.value;
        }
        this._field1Counter.textContent = `${this._field1Input.value.length}/${this._field1MaxLength}`;
        this._field2Counter.textContent = `${this._field2Input.value.length}/${this._field2MaxLength}`;

        console.log("updateView:", { field1: this._field1Value.length, field2: this._field2Value.length });
    }

    public getOutputs(): IOutputs {
        const outputs: IOutputs & Record<string, string | undefined> = {
            field1: this._field1Value,
            field2: this._field2Value
        };
        const targetFieldLogicalName = this._context.parameters.targetFieldLogicalName.raw;
        if (targetFieldLogicalName) {
            outputs[targetFieldLogicalName] = this._field2Value;
        }
        console.log("getOutputs:", { field1: this._field1Value.length, field2: this._field2Value.length, targetFieldLogicalName });
        return outputs;
    }

    public destroy(): void {
        this._field1Input.removeEventListener("input", this.onInput);
        this._field2Input.removeEventListener("input", this.onInput);
    }
}