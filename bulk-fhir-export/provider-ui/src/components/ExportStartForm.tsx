export default function ExportStartForm(props: {
  disable: boolean;
  label: string;
  handleSubmit: (e: { preventDefault: () => void }) => void;
}) {
  const { disable, label, handleSubmit } = props;
  return (
    <form className="usa-form" onSubmit={handleSubmit}>
      <legend className="usa-legend usa-legend--large display-flex flex-column">
        {label}
      </legend>
      <button className="usa-button" disabled={disable} type="submit">
        Start new export
      </button>
    </form>
  );
}
