export default class CoordinateInputModal {
  private modal: HTMLDivElement;
  private xInput: HTMLInputElement;
  private yInput: HTMLInputElement;
  private confirmButton: HTMLButtonElement;
  private cancelButton: HTMLButtonElement;

  constructor(
    private onDone: (result: { x: number; y: number } | null) => void
  ) {
    // Create the modal container
    this.modal = document.createElement("div");
    this.modal.style.position = "fixed";
    this.modal.style.top = "0";
    this.modal.style.left = "0";
    this.modal.style.width = "100%";
    this.modal.style.height = "100%";
    this.modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    this.modal.style.display = "flex";
    this.modal.style.justifyContent = "center";
    this.modal.style.alignItems = "center";
    this.modal.style.zIndex = "1000000000";

    // Create the modal content box
    const contentBox = document.createElement("div");
    contentBox.style.backgroundColor = "#fff";
    contentBox.style.padding = "20px";
    contentBox.style.borderRadius = "8px";
    contentBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    contentBox.style.maxWidth = "400px";
    contentBox.style.width = "100%";
    contentBox.style.boxSizing = "border-box";

    // Create the x-coordinate input
    const xLabel = document.createElement("label");
    xLabel.textContent = "X Coordinate:";
    xLabel.style.display = "block";
    xLabel.style.marginBottom = "5px";

    this.xInput = document.createElement("input");
    this.xInput.type = "number";
    this.xInput.style.width = "100%";
    this.xInput.style.marginBottom = "15px";
    this.xInput.style.padding = "10px";
    this.xInput.style.border = "1px solid #ccc";
    this.xInput.style.borderRadius = "4px";
    this.xInput.style.boxSizing = "border-box";

    // Create the y-coordinate input
    const yLabel = document.createElement("label");
    yLabel.textContent = "Y Coordinate:";
    yLabel.style.display = "block";
    yLabel.style.marginBottom = "5px";

    this.yInput = document.createElement("input");
    this.yInput.type = "number";
    this.yInput.style.width = "100%";
    this.yInput.style.marginBottom = "15px";
    this.yInput.style.padding = "10px";
    this.yInput.style.border = "1px solid #ccc";
    this.yInput.style.borderRadius = "4px";
    this.yInput.style.boxSizing = "border-box";

    // Create the confirm button
    this.confirmButton = document.createElement("button");
    this.confirmButton.textContent = "Confirm";
    this.confirmButton.style.marginRight = "10px";
    this.confirmButton.style.padding = "10px 20px";
    this.confirmButton.style.border = "none";
    this.confirmButton.style.backgroundColor = "#007bff";
    this.confirmButton.style.color = "#fff";
    this.confirmButton.style.borderRadius = "4px";
    this.confirmButton.style.cursor = "pointer";

    // Create the cancel button
    this.cancelButton = document.createElement("button");
    this.cancelButton.textContent = "Cancel";
    this.cancelButton.style.padding = "10px 20px";
    this.cancelButton.style.border = "none";
    this.cancelButton.style.backgroundColor = "#ccc";
    this.cancelButton.style.color = "#000";
    this.cancelButton.style.borderRadius = "4px";
    this.cancelButton.style.cursor = "pointer";

    // Append elements
    contentBox.appendChild(xLabel);
    contentBox.appendChild(this.xInput);
    contentBox.appendChild(yLabel);
    contentBox.appendChild(this.yInput);
    contentBox.appendChild(this.confirmButton);
    contentBox.appendChild(this.cancelButton);
    this.modal.appendChild(contentBox);

    // Add event listeners
    this.confirmButton.addEventListener("click", () => this.onConfirm());
    this.cancelButton.addEventListener("click", () => this.onCancel());
  }

  private onConfirm(): void {
    const xValue = parseFloat(this.xInput.value);
    const yValue = parseFloat(this.yInput.value);

    // Validate input
    if (isNaN(xValue) || isNaN(yValue)) {
      alert("Please enter valid numbers for both coordinates.");
      return;
    }

    this.onDone({ x: xValue, y: yValue }); // Pass the x and y values to the callback
    this.close();
  }

  private onCancel(): void {
    this.onDone(null); // Pass null to the callback when canceled
    this.close();
  }

  private close(): void {
    if (this.modal.parentElement) {
      this.modal.parentElement.removeChild(this.modal);
    }
  }

  public open(): void {
    document.body.appendChild(this.modal);
    this.xInput.focus();
  }
}
