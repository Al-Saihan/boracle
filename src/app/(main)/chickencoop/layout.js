export const metadata = {
    title: "Chicken Coop | Boracle",
    description: "Find empty lab rooms at BRACU — search by time and department to discover available CSE, EEE, PHY, MIC and ARC labs.",
    openGraph: {
        title: "Chicken Coop | Boracle",
        description: "Find empty lab rooms at BRACU — search by time and department to discover available CSE, EEE, PHY, MIC and ARC labs.",
        url: "https://boracle.app/chickencoop",
        siteName: "B.O.R.A.C.L.E",
        images: [
            {
                url: "https://usis-cdn.eniamza.com/boracleOG.png",
                width: 1200,
                height: 630,
                alt: "Boracle - Chicken Coop",
            },
        ],
    },
};

export default function Layout({ children }) {
    return children;
}
