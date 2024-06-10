// import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";

function ViewDocument() {
    // const { jwt } = useAuth();
    const { document } = useDocument();

    return (
        <div className="document-view">
            {document.type === 'application/pdf' ? (
                <iframe src={document.histories[0].url} width="100%" height="600px"></iframe>
            ) : (
                <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.histories[0].url)}&embedded=true`} width="100%" height="600px"></iframe>
            )}
        </div>
    );
}

export default ViewDocument;
