import { IconFileDownload } from "@trussworks/react-uswds";

type DownloadFileButtonProps = {
  link: string;
};

export default function DownloadFileButton({
  link,
}: DownloadFileButtonProps): JSX.Element {
  return (
    <a href={link} title="Download" className="text-ink">
      <IconFileDownload className="position-relative top-05" />
      <span className="position-absolute display-none">Download</span>
    </a>
  );
}
