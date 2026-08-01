function createPath(artist, venue) {
    return `${artist}--${venue}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replaceAll(" ", "-");
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000)
        .toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

async function getTicketekEvents(path) {

    const response = await fetch(
        `https://prod-cms-api.ticketek.com.ar/api/1.0/node%3Fpath%3D${path}`
    );

    const text = await response.text();
    const data = JSON.parse(text);

    const ticketInfo = data.widgets.left?.find(
        widget => widget?.type === "tkt-show-ticket"
    );

    const header = data.widgets.header?.find(
        widget => widget?.type === "tkt-show-header"
    );

    return {
        name: data.title,
        date: formatDate(ticketInfo?.date),
        price: ticketInfo?.price ?? "Consultar",
        buyUrl: ticketInfo?.link ?? "",
        image: header?.image
            ? `https:${header.image}`
            : null,
        venue: ticketInfo?.venue ?? ""
    };
}

export async function getTicketekArtistEvents(artistName) {

    const searchResponse = await fetch(
        `https://prod-cms-search.ticketek.com.ar/api/1.1/search/${encodeURIComponent(artistName)}`
    );

    const searchData = await searchResponse.json();

    const artist = searchData.resultados?.find(
        result => result.url === artistName
    ) ?? searchData.resultados?.[0];

    if (!artist) {
        return [];
    }

    const events = await Promise.all(
        artist.shows.map(async (show) => {

            const path = createPath(
                artist.url,
                show.venue
            );

            try {
                return await getTicketekEvents(path);

            } catch (error) {

                console.log(
                    `No se pudo obtener ${path}`,
                    error.message
                );

                return null;
            }
        })
    );
    return events.filter(Boolean);
}
