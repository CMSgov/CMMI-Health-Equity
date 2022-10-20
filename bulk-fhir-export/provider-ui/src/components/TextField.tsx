import React from "react";
import { IconInfo } from "@trussworks/react-uswds";
import "../styles/text-field.css";
import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { ContextTooltip } from "./ContextTooltip";

type TextFieldProps = {
  value?: string;
  onChange?: Function;
  label?: string;
  name?: string;
  id?: string;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

export default function TextField({
  value,
  onChange,
  label,
  id,
  name,
  error,
  readOnly,
  disabled,
  tooltip,
}: TextFieldProps): JSX.Element {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: "top" });
  let errorEl =
    error == null ? null : (
      <span className="usa-error-message" id="input-error-message">
        {error}
      </span>
    );

  let labelEl =
    label == null ? null : (
      <label className="usa-label" htmlFor={name ?? ""}>
        {label}
        {tooltip && (
          <span
            ref={setTriggerRef}
            className="margin-left-1 position-relative top-05"
          >
            <IconInfo style={{ fill: "#0071BC" }} />
          </span>
        )}
        {tooltip && visible && (
          <ContextTooltip
            text={tooltip}
            setRef={setTooltipRef}
            getProps={getTooltipProps}
            getArrowProps={getArrowProps}
          />
        )}
      </label>
    );

  return (
    <React.Fragment>
      {labelEl}
      {errorEl}
      <input
        readOnly={readOnly ?? false}
        disabled={disabled ?? false}
        className="usa-input"
        id={id ?? ""}
        name={name ?? ""}
        type="text"
        value={value || ""}
        onChange={(e) => {
          if (onChange != null) onChange(e);
        }}
      />
    </React.Fragment>
  );
}
