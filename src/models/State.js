import { prisma } from "../../config/prisma.js";

// Create (insert) DATA

export const createState = async (name) =>{
    return await prisma.state.create({
        data : {name}
    });
};

// Read (select all)
export const findAllStates = async () => {
    return await prisma.state.findMany();
}

// read (select by id or other field)

export const findStateById = async () =>{
    return await prisma.state.findUnique({
        where : { id: stateId},
    });
};

// update (update) DATA

export const updateState = async(id,data)=>{
    return await prisma.state.update({
        where:{id},
        data:{
            name:data.name,
        },
    });
};

export const findStateByName = async (stateName) => {
    return await prisma.state.findUnique({
        where: {
            name: stateName,
        },
    });
}

export const deleteState = async(id) =>{
    return await prisma.state.delete({
        where:{id},
    }) 
}