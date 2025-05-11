// components/GoogleDriveViewer.tsx
'use client';

export default function PDFViewer({ url }: { url: string }) {
    const convertUrl = (url: string) => {
        const fileId = url.match(/\/d\/(.+?)\//)?.[1];
        return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
    };

    return (
        <div className=" h-[800px] w-full rounded-lg shadow-lg overflow-hidden">
            <iframe
                src={convertUrl(url)}
                className="w-full h-full border-none"
                allow="autoplay"
            />
        </div>
    );
}

