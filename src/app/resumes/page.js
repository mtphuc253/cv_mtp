import { CvBuilder } from "@/components/cv/cv-builder"

export const metadata = {
  title: "CV Builder",
  description: "Build an ATS-friendly CV in the browser with a live preview, templates and PDF export. Your data never leaves your device.",
};

export default function Page() {
  return <CvBuilder />;
}
