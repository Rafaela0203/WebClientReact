import React, {useEffect, useState} from "react";
import {IProduct} from "@/commons/interfaces.ts";
import ProductService from "@/service/ProductService.ts";
import {Link} from "react-router-dom";

export function ProductListPage(){
    const [data, setData] = React.useState<IProduct[]>([]);
    const [apiError, setApiError] = React.useState<boolean>(false);
    const [apiMessage, setApiMessage] = useState<String>("");
    const [apiSuccess, setApiSuccess] = useState<boolean>(false);

    useEffect(() => {
        loadData();

    }, []);

    const loadData = async () => {
        setApiError(false);
        setApiMessage("")

        const response = await ProductService.findAll();
        if (response.status === 200) {
            setData(response.data);
        }else {
            setApiError(true);
            setApiMessage("Falha ao carregar os dados");
            setData([]);
        }
    }

    const onClickRemove = async (id?: number) => {
        setApiError(false);
        setApiMessage("");
        setApiSuccess(false);
        if(id){
            const response = await ProductService.remove(id);
            if (response.status === 204) {
                setData(data.filter((product) => product.id !== id));
                setApiSuccess(true);
                setApiMessage("Produto removido com sucesso");
            }else {
                setApiError(true);
                setApiMessage("Falha ao remover o produto");
            }
        }
    }
    return (
        <>
            <main className="container">
                <div className="text-center">
                    <span className="h3 mb-3 fw-normal">Product List Page</span>
                </div>
                <Link to="/products/new"
                      className="btn btn-success mb-3">
                    Novo Produto
                </Link>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Preço</th>
                        <th>Categoria</th>
                        <th>Editar</th>
                        <th>Remover</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category?.name}</td>
                            <td><Link
                                className="btn btn-primary"
                                to={`/products/${product.id}`}
                                >
                                    Editar
                                </Link></td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => onClickRemove(product.id)}>
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {apiError && (
                    <div className="alert alert-danger" role="alert">
                        {apiMessage}
                    </div>
                )}
                {apiSuccess && (
                    <div className="alert alert-success" role="alert">
                        {apiMessage}
                    </div>
                )}
            </main>

        </>
    )
}