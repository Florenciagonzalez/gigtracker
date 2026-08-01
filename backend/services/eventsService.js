import {getTicketekArtistEvents } from "./ticketekService.js"


export async function searchEvents(artist){
    const [ ticketek ] = await Promise.all([ getTicketekArtistEvents(artist)]);

    return [...ticketek];
}

export async function searchFollowedArtists(artists) {

    const events = await Promise.all(
        artists.map(artist => searchEvents(artist))
    );

    return events.flat();
}