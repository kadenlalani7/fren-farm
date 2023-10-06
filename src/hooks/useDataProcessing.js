import { useState, useEffect } from 'react';

const useDataProcessing = (address) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://fren-api-app-9351a5576832.herokuapp.com/get_purchase_data/${address}`);
                const retrievedData = await response.json();
                setData(retrievedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [address]);

    return data;
};

export default useDataProcessing;
