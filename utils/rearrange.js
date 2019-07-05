import { similarity } from './stringSimilarity'

export function rearrange(array, strCriteria) {
    return array.sort((a, b) => {
        return similarity(b.name, strCriteria) - similarity(a.name, strCriteria) 
    })
}