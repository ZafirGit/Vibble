import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`;

export default function PDFViewer({ fileUrl, onViewPage }) {
  const [numPages, setNumPages] = useState(0);
  const [pdf, setPdf] = useState(null);
  const containerRef = useRef();

  // Load PDF on mount or URL change
  useEffect(() => {
    const fetchPdf = async () => {
      const loadingTask = getDocument(fileUrl);
      const loadedPdf = await loadingTask.promise;
      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
    };

    fetchPdf();
  }, [fileUrl]);

  // Set up intersection observer to track viewed pages
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset.page) {
            const viewedPage = parseInt(entry.target.dataset.page);
            onViewPage?.(viewedPage);
          }
        });
      },
      { threshold: 0.5 }
    );

    const targets = containerRef.current.querySelectorAll(".pdf-page");
    targets.forEach((el) => observer.observe(el));

    return () => {
      targets.forEach((el) => observer.unobserve(el));
    };
  }, [pdf]);

  return (
    <div ref={containerRef} className="space-y-4">
      {Array.from({ length: numPages }, (_, i) => (
        <canvas
          key={i}
          data-page={i + 1}
          className="pdf-page border shadow-md mx-auto"
          ref={async (canvas) => {
            if (canvas && pdf) {
              const page = await pdf.getPage(i + 1);
              const viewport = page.getViewport({ scale: 1.5 });
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              await page.render({ canvasContext: context, viewport }).promise;
            }
          }}
        />
      ))}
    </div>
  );
}
