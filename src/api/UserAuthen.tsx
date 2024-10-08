
import axios from "axios"

const checkLogin = async () => {
    const result = await axios.get("/api/auth/user", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage && localStorage.token
        },
    })
    return (result.data)
}

//File
const uploadFile = async (p: string, file: File, type: string) => {
    const formData = new FormData()
    formData.append("file", file)
    if (type === "pic") {
        const fileUpload = await axios.post("/api/" + p + "/pic", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.token,
            },
        })
        return fileUpload
    }
    if (type === "file") {
        const fileUpload = await axios.post("/api/" + p + "/file", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.token,
            },
        })
        return fileUpload
    }
}
const getPicById = async (p: string, u: string) => {
    const result = await axios.get("/api/" + p + "/pic?id=" + u,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.token,
            },
        }
    )
    return result.data
}
const deleteFile = async (p: string, genre: string, name: string, id: string) => {
    const result = await axios.delete(process.env.server_url + p + `/${genre}?name=${name}&id=${id}`,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.token,
            },
        },
    )
    return result.data
}

//Item
const getItem = async (p: string, a: string, search: string, skip: number | undefined, limit: number | undefined, lo?: string, area?: string, sort?: number, lis?: string) => {
    const result = await axios.get(`/api/${p}/${a}?archive=${a}&search=${search}&lo=${lo ? lo : ""}&skip=${skip ? skip : ""}&limit=${limit ? limit : ""}&area=${area ? area : ""}&sort=${sort ? sort : ""}&lisense=${lis ? lis : ""}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage && localStorage.token
        },
    })
    return result.data
}
const getOneItembySlug = async (p: string, a: string, s: string) => {
    const result = await axios.get(`/api/${p}/${a}?slug=${s}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage && localStorage.token
        },
    })
    return result.data
}
const getOneUserbyId = async (p: string, a: string, s: string) => {
    const result = await axios.get(`/api/${p}/${a}?id=${s}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage && localStorage.token
        },
    })
    return result.data
}
const createItem = async (p: string, a: string, body: any) => {
    const result = await axios.post("/api/" + p + "/" + a, body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token,
        },
    })
    return result.data
}
const updateItem = async (p: string, a: string, id: string, body: any) => {
    const result = await axios.put("/api/" + p + "/" + a + "?id=" + id, body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token,
        },
    })
    return result.data
}
const deleteItem = async (p: string, a: string, id: string) => {
    const result = await axios.delete("/api/" + p + "/" + a + "?id=" + id, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token,
        },
    })
    return result.data
}
const updateProfile = async (body: any) => {
    const result = await axios.put(process.env.server_url + "user", body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token,
        },
    })
    return result.data
}
const viewLesson = async (p: string, slug: string, course: string,) => {
    const result = await axios.get(process.env.server_url + p + "/lesson" + "?slug=" + slug + "&course=" + course, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token,
        },
    })
    return result.data
}
const createLesson = async (p: string, body: any,) => {
    const result = await axios.post(process.env.server_url + p + "/lesson", body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token,
        },
    })
    return result.data
}
const updateLesson = async (p: string, id: string, body: any,) => {
    const result = await axios.put(process.env.server_url + p + "/lesson?id=" + id, body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token,
        },
    })
    return result.data
}


export const UserAuthen = {
    checkLogin,
    uploadFile,
    createItem,
    getItem,
    getOneItembySlug,
    getOneUserbyId,
    getPicById,
    deleteFile,
    updateItem,
    deleteItem,
    updateProfile,
    viewLesson,
    createLesson,
    updateLesson
}