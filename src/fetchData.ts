export default async function fetchData<Interface>(url: string): Promise<Interface | null> {
    try {
        const request = await fetch(url)
        if (!request.ok) throw new Error('Request failed')
        
        const requestJSON = await request.json()

        return await requestJSON
    } catch (error) {
        if (error instanceof Error) console.error("Error fetch:" + error.message)
        return null
    }
}