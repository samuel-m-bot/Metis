const RevisionLog = ({ itemData }) => {
  return (
    <div className="revision-log">
      <h3>Revision Log</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Revision Number</th>
            <th>Description</th>
            <th>Date</th>
            <th>Author</th>
            <th>Change Request ID</th>
          </tr>
        </thead>
        <tbody>
          {itemData?.revisions && itemData?.revisions?.length > 0 ? (
            itemData.revisions.map((revision, index) => (
              <tr key={index}>
                <td>{revision.revisionNumber}</td>
                <td>{revision.description}</td>
                <td>{new Date(revision.date).toLocaleDateString()}</td>
                <td>{revision.authorName}</td> 
                <td>{revision.changeRequestId || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No revisions available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RevisionLog;
