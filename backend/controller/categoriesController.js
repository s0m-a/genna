import Categories from "../models/category_model.js";

export default class CategoriesController{


    static async CreateCategories(data){

        const {name, description} = data;
        for(const key of ['name', 'description']){
            if(!data[key]){
                return ({status: 'error', message:`feild ${key} is required`});
            }
        }


        if(await Categories.findOne({where:{name}})){
            return ({status: 'error', message:`category already exist`});
        }
        try{
            const createData = {
                name,
                description
            }  
            const category = await Categories.create(createData);
            return ({status: 'success', message:`category created`});
        }catch (err){
            return ({status: 'error', message:` errror creating category:`, err});
        }
    }

    static async getAllCategories(){
        try {
            const getCategories = await Categories.findAll(
                {attributes: ['name', 'description']}
            );
            
            if(!getCategories)
            {
                return ({status: 'notFound', message:`no catergories was found`});
            }
            return ({status: 'success', message:`catergories: `, getCategories });
        } catch (err) {
            return ({status: 'error', message:`error fecting categories, error:`, err});
        }
    }


    static async getCategoryById(data)
    {
        try {
            const category = await Categories.findByPk(data,
                {attributes: ['name', 'description']}
            );
            if(!category){
                return ({status: 'error', message:`category not found`});
            }
            return ({status: 'success', message:`category retrived:`, category});
        } catch (error) {
            return ({status: 'error', message:`can't fetch catergory, error:`});
        }
    }

    static async updateCategories(data)
    {
        const {id, name, description} = data;
        try {
            const category = await Categories.findByPk(id);
            if(!category)
            {
            return ({status: 'error', message:`cant find category`});
            }
            category.name = name || category.name;
            category.description = description || category.description;
            await category.save();
            return ({status: 'success', message:`category updated,update:`, category});

        } catch (err) {
            return ({status: 'error', message:`Error updating category:`, err});
        }

    }

    static async deleteCategories(data){
        const {id} = data;
        
        try {
            const category = await Categories.findByPk(id);
            if(!category)
            {
                return ({status: 'error', message:`can not found categories`});
            }
            await category.destroy({where: {id}})
            return ({status: 'success', message:` category deleted:`});
        
        } catch (err) {
            return ({status: 'error', message:`Error deleting category:`, err});
        }
    }





}

