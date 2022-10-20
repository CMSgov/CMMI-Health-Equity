type ContextTooltipProps = {
  text: string,
  setRef: Function,
  getProps: Function,
  getArrowProps: Function,
}

export const ContextTooltip = ({ text, setRef, getProps, getArrowProps }:ContextTooltipProps) => {
  return (
    <div ref={setRef} {...getProps({ className: "tooltip-container" })}>
      <p>{text}</p>
      <div {...getArrowProps({ className: "tooltip-arrow" })} />
    </div>
  );
};
