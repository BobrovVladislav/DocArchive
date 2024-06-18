import { createContext, useContext, useState } from 'react';

const DocumentContext = createContext();

// eslint-disable-next-line react/prop-types
export const DocumentProvider = ({ children }) => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);

    const getDocument = async (documentID, jwt) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/documents/${documentID}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDocument(data);
            } else {
                console.error("Ошибка при получении документа");
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса на получение документа", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DocumentContext.Provider value={{ document, getDocument, loading }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocument = () => {
    const context = useContext(DocumentContext);

    if (!context) {
        throw new Error('useDocument должен использоваться внутри DocumentProvider.');
    }

    return context;
};
