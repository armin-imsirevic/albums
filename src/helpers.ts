
export const unique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index
}

export const artistURLRegex = /^\/artist\/\d+$/g;
