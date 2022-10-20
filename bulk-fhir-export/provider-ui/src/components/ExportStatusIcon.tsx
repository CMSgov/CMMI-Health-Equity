import React, { ComponentType } from "react";
import { IconCheckCircle, IconCancel, IconLoop } from "@trussworks/react-uswds";
import { IconProps } from "@trussworks/react-uswds/lib/components/Icon/Icon";

type ExportStatusIconProps = {
  status: string;
};

type IconLibrary = {
  "In progress": {
    component: ComponentType<IconProps>;
    color: string;
  };
  Submitted: {
    color: string;
    component: ComponentType<IconProps>;
  };
  Cancelled: {
    color: string;
    component: ComponentType<IconProps>;
  };
};

const icons = {
  "In progress": {
    color: "#000000",
    component: IconLoop,
  },
  Submitted: {
    color: "#4ECB71",
    component: IconCheckCircle,
  },
  Cancelled: {
    color: "#E51C3E",
    component: IconCancel,
  },
};

export default function ExportStatusIcon({
  status,
}: ExportStatusIconProps): JSX.Element {
  const icon = icons[status as keyof IconLibrary];
  const Component = icon.component;

  return (
    <Component
      className="position-relative top-05 margin-right-2"
      style={{ fill: icon.color }}
    />
  );
}
