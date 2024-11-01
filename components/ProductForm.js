import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import {useRouter} from "next/router";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images,
    category:assignedCategory,
    properties:assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    
    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
          title,description,price,category,
          properties:productProperties
        };
        if (_id) {
          //update
          await axios.put('/api/products', {...data,_id});
        } else {
          //create
          await axios.post('/api/products', data);
        }
        setGoToProducts(true);
      }
      if (goToProducts) {
        router.push('/products');
      }   
    

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            const data = new FormData(); 
            for (const file of files) {
                data.append('file', file);
            } 
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });
            console.log(res);
        }
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
      let catInfo = categories.find(({_id}) => _id === category);
      propertiesToFill.push(...catInfo.properties);
      while(catInfo?.parent?._id) {
        const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
        propertiesToFill.push(...parentCat.properties);
        catInfo = parentCat;
      }
    }

    function setProductProp(propName,value) {
        setProductProperties(prev => {
          const newProductProps = {...prev};
          newProductProps[propName] = value;
          return newProductProps;
        });
      }

    return (
        <form onSubmit={saveProduct}>
            <label>Products name</label>
            <input type="text"
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <label>Category</label>
            <select 
            value={category} 
            onChange={ev => setCategory(ev.target.value)}
            >
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="">
          <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                    
                    <select value={productProperties[p.name]}
                    onChange={ev => 
                        setProductProp(p.name, ev.target.value)
                        }>
                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            ))}
            <label>
                Photos
            </label>
            <div className="mb-2">
                {/* Input for uploading images */}
            </div>
            <label>Description</label>
            <textarea
                placeholder="description "
                value={description}
                onChange={ev => setDescription(ev.target.value)} />
            <label>Price</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)} />
            <button type="submit" className="btn-primary">
                Save
            </button>
        </form>
    );
}