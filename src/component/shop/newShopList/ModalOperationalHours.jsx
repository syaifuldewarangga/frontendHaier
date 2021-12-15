import React from 'react'

function ModalOperationalHours(props) {
    console.log(props.data)
    return (
        <div class="modal fade" id="modalOperationalHours" tabindex="-1" aria-labelledby="modalOperationalHoursLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Operational Hours</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <th>Hari Buka</th>
                            <th className='px-3'>:</th>
                            <th>{props.data.open_day}</th>
                        </tr>
                        <tr>
                            <th>Hari Tutup</th>
                            <th className='px-3'>:</th>
                            <th>{props.data.close_day}</th>
                        </tr>
                        <tr>
                            <th>Jam Operasional</th>
                            <th className='px-3'>:</th>
                            <th>{props.data.open_hour}</th>
                        </tr>
                        
                    </table>
                </div>
                </div>
            </div>
        </div>
    )
}

export default ModalOperationalHours
