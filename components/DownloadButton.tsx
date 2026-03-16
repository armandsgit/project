'use client';

interface DownloadButtonProps {
  image: string;
}

export default function DownloadButton({ image }: DownloadButtonProps) {
  return (
    <a
      href={image}
      download="background-removed.png"
      className="inline-flex rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-accent/90"
    >
      Download PNG
    </a>
  );
}
