# AutoSplitTextControl - Power Apps Component Framework Control

This repository contains a Power Apps Component Framework (PCF) control named **AutoSplitTextControl**, designed for Dynamics 365 CRM or Dataverse environments. The control provides two text areas: a primary field (`field1`) with a user-configurable maximum length and an overflow field (`field2`) with a fixed 4000-character limit. When `field1` reaches its maximum length, excess text automatically overflows to `field2`, which is saved to a Dataverse field specified by `targetFieldLogicalName`.

---

## Overview

### Purpose

- Provides a reusable PCF control to split text input across two single-line text fields in Dynamics 365, with dynamic length limits and seamless Dataverse integration.

### Features

- **Configurable maximum length** for `field1` via the `maxLength` property (capped at 4000 characters).
- **Automatic overflow** of excess text from `field1` to `field2` (supports up to 4000 characters).
- **Real-time character counters** for both fields (e.g., `150/1000` for `field1`, `50/4000` for `field2`).
- **Visual feedback** with a red border on `field1` when the maximum length is reached.
- **Consistent styling** using Segoe UI, Arial, sans-serif fonts.
- **Integration with Dataverse**: `field1` and `field2` bind to `SingleLine.Text` fields, with `field2` data saved to a field specified by `targetFieldLogicalName`.
- **Prevents errors** like "You have exceeded the maximum number of 100 characters" by enforcing field length limits.

---

## Technology Stack

- **TypeScript** for control logic.
- **CSS** for styling.
- **Power Apps CLI** for development and deployment.

---

## Prerequisites

- **Node.js:** Version 14.x or later (install via [nodejs.org](https://nodejs.org/)).
- **Power Apps CLI:** Install using  
  ```bash
  npm install -g @microsoft/powerapps-cli
  ```

  ## Authenticate with  
  ```bash
  pac auth create
  ```
- **Visual Studio Code** or another code editor (recommended).
- **Dataverse Environment:** Access to a Dynamics 365 CRM or Power Apps environment with System Administrator or System Customizer permissions.
- **Dataverse Fields:** Two `SingleLine.Text` fields with a maximum length of 4000 characters (e.g., `new_primarytext`, `new_overflowtext`).

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/AutoSplitTextControl.git
cd AutoSplitTextControl
```

### Install Dependencies

```bash
npm install
```

### Initialize the Solution

Run the following command to set up the solution with your publisher details:

```bash
pac solution init --publisher-name "AutoSplitTextDev" --publisher-prefix autosplit
```

Add the PCF project reference:

```bash
pac solution add-reference --path .
```

### Build the Project

```bash
msbuild /t:restore
msbuild
```

This generates a `.zip` file (e.g., `AutoSplitTextControl_0_0_1_0.zip`) in the `bin/debug` folder.

---

## Deployment

### Import the Solution

Use the Power Apps CLI to import the solution into your Dataverse environment:

```bash
pac solution import --path bin\debug\AutoSplitTextControl_0_0_1_0.zip --environment <EnvironmentIdOrName>
```
Replace `<EnvironmentIdOrName>` with your environment ID (find it with `pac env list`).

**Alternatively**, import via the Power Apps Maker Portal:

1. Go to [https://make.powerapps.com](https://make.powerapps.com)
2. Select your environment.
3. Use **Solutions > Import solution**.

### Publish Customizations

```bash
pac solution publish
```
Or publish manually in the Maker Portal after importing.

### Add to Form

1. Open a model-driven app form in the Power Apps Maker Portal.
2. Select a `SingleLine.Text` field (e.g., `new_overflowtext`), go to **Properties**, and click **Add Control**.
3. Choose **AutoSplitTextControl** (e.g., `autosplit_AutoSplitTextControl`).

#### Configure

- Bind `field1` to `new_primarytext`.
- Bind `field2` to `new_overflowtext`.
- Set `targetFieldLogicalName` to `new_overflowtext`.
- Set `maxLength` to the desired limit for `field1` (e.g., 1000).
- Save and publish the form.

---

## Usage

### In-App Behavior

- **Primary Text (`field1`):** Enter text up to the configured `maxLength` (e.g., 1000 characters). A character counter shows usage (e.g., `150/1000`).
- **Overflow Text (`field2`):** Excess text from `field1` automatically moves to `field2`, which supports up to 4000 characters. A counter shows usage (e.g., `50/4000`).
- **Visual Feedback:** A red border appears on `field1` when it reaches its limit, and focus shifts to `field2`.
- **Saving Data:** `field1` saves to `new_primarytext`, and `field2` saves to the field specified by `targetFieldLogicalName` (e.g., `new_overflowtext`).

### Browser Support

Compatible with modern browsers (e.g., Chrome, Edge, Firefox) used in Dynamics 365.

---

## Testing

Run locally with:

```bash
npm run start
```

Open the provided URL (e.g., [http://localhost:8181](http://localhost:8181)) to test the control.

Check the browser console (F12) for logs to verify:

- `maxLength` value (e.g., `init maxLength: 1000`).
- Field lengths (e.g., `getOutputs: { field1: 150, field2: 50, targetFieldLogicalName: "new_overflowtext" }`).

---

## Known Issues

### 100-Character Limit Error

- **Cause:** Dataverse fields (`new_primarytext` or `new_overflowtext`) have a 100-character limit.
- **Fix:** Update fields to 4000 characters in the Power Apps Maker Portal. Verify `targetFieldLogicalName` points to a field with a 4000-character limit.
- **Debug:** Check console logs in `getOutputs` for field lengths exceeding 100 characters.

### ESLint Error (`Type number trivially inferred`)

- **Cause:** Explicit type annotation on `_field2MaxLength`.
- **Fix:** Removed in `index.ts` (`private _field2MaxLength = 4000;`).

### Control Not Loading

- Ensure `pac pcf push` completed successfully.
- Verify form bindings and publish customizations.

---

## Contributing

1. Fork the repository.
2. Create a new branch  
   ```bash
   git checkout -b feature-branch
   ```
3. Make changes and commit  
   ```bash
   git commit -m "Describe changes"
   ```
4. Push to the branch  
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

---

## License

MIT License - See the [LICENSE](LICENSE) file for details.

---

## Contact

- **Author:** Advic Tech
- **Email:** developer@advic.io
- **Issues:** Report bugs or suggestions on the [GitHub Issues page](../../issues).
```
