import { useDocument } from "../context/DocumentContext";
import "../assets/styles/style-components/ViewDocument.scss";

function ViewDocument() {
    const { document } = useDocument();

    return (
        <div className="view">
            <div className="view__inner">
                {document.type === 'application/pdf' ? (
                    <iframe src={document.histories[0].url} width="100%" height="800px"></iframe>
                ) : (
                    <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.histories[0].url)}&embedded=true`} width="100%" height="600px"></iframe>
                )}
            </div>
        </div>
    );
}

export default ViewDocument;
