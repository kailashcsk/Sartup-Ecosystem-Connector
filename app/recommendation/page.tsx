"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { groupBy } from 'lodash';

const LazyMap = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function Home() {

    const [recommendations, setRecommendations] = useState([])

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const response = await fetch('/api/fetchEventRecommendations');
                const data = await response.json();

                const recoms = groupBy(data.data, 'type');
                setRecommendations(recoms);

            } catch (error) {
                console.log('Error fetching users:', error);
            }
        }

        fetchRecommendations();
    }, []);

    console.log('Recommendations:', recommendations);

    return (
        <main style={{
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0
        }}>
            <LazyMap recommendations={recommendations} />
        </main>
    );
}