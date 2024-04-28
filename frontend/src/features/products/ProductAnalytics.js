import { useFetchProductPerformanceReportQuery } from './productsApiSlice';

const ProductAnalytics = () => {
    const { data: reportData, isFetching, error } = useFetchProductPerformanceReportQuery();

    console.log(reportData)
    if (isFetching) return <div className="text-center"><strong>Loading...</strong></div>;
    if (error) return <div className="alert alert-danger">Error fetching report: {error?.data?.message}</div>;

    return (
        <div className="container mt-3">
            <h1 className="mb-4">Product Performance <span className="metis-green">Analytics</span></h1>
            {reportData ? (
                <>
                    <h3>Sales Performance: {reportData.salesPerformance}</h3>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {reportData.customerFeedbackSummary.map((product, index) => (
                            <div key={index} className="col">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="card-title">{product.productName}</h5>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text"><strong>Product Code:</strong> {product.productId}</p>
                                        <p className="card-text"><strong>Customer Feedback:</strong> {product.customerFeedback}</p>
                                        <p className="card-text"><strong>Description:</strong> {product.productDescription}</p>
                                        <p className="card-text"><strong>Lifecycle Stage:</strong> {product.lifecycleStage}</p>
                                        <p className="card-text"><strong>Sales Amount:</strong> ${product.salesAmount}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>No data available.</div>
            )}
        </div>
    );
};

export default ProductAnalytics;
