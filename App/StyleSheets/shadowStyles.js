import { silver } from "../colors"

const stampShadow = {
    shadowColor: "black",
    shadowOffset: {
        width: 1,
        height: 3,
    },
    shadowOpacity: 2,
    shadowRadius: 1,

    elevation: 5,
}

const lowerShadow = {
    shadowColor: "black",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 2,
    shadowRadius: 2,

    elevation: 5,
}

const evenShadow = {
    shadowColor: silver,
    shadowOffset: {
        width: -1,
        height: 1,
    },
    shadowOpacity: 2,
    shadowRadius: 5,

    elevation: 5,
}

export {stampShadow, lowerShadow, evenShadow}

