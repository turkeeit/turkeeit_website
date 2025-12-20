export default function ServiceDetailsModal({ service, loading }) {
  if (!service) return null;

  return (
    <div className="modal fade" id="serviceDetailsModal" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">{service.name}</h6>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body small">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h6>Service Includes</h6>
                <ul>
                  {service.service_includes?.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>

                <h6>Service Excludes</h6>
                <ul>
                  {service.service_excludes?.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>

                <h6>Time Duration</h6>
                <div>
                  {service.duration_min} – {service.duration_max} minutes
                </div>

                {service.notes && (
                  <>
                    <h6 className="mt-2">Notes</h6>
                    <div>{service.notes}</div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
