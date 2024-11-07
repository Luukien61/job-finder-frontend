import React, {useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {usePdfItems} from "@/zustand/AppState.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'react-pdf/dist/Page/AnnotationLayer.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

// const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
// const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.mjs');
//
// fs.cpSync(pdfWorkerPath, './dist/pdf.worker.mjs', { recursive: true });

const FlexStickyLayout = () => {
    const [numPages, setNumPages] = useState<number>();
    const {url,setUrl} = usePdfItems()
    if(url==='') setUrl('https://jobfinder-kienluu.s3.ap-southeast-1.amazonaws.com/nhan-dang-thuc-the.pdf')

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }
    return (
        <div className={`h-full max-h-[500px] overflow-y-auto w-fit`}>
            <Document   file={`${url}`} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                    <Page   key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    );
};

export default FlexStickyLayout;