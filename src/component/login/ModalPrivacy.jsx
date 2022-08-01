import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

function ModalPrivacy(props) {
  const [privacyPoicy, setPrivacyPolicy] = useState('')

  const getPrivacyPolicy = async () => {
      await axios.get(props.base_url + 'privacy-policy')
      .then((res) => {
          setPrivacyPolicy(res.data.content)
      }).catch((err) => {
        console.log(err.response)
      })
  }

  useEffect(() => {
      getPrivacyPolicy()
  }, [])


    return (
        <div class="modal fade" id="privacyModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Privacy Policy</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
             <div dangerouslySetInnerHTML={{ __html: privacyPoicy }}></div>
            </div>
          </div>
        </div>
      </div>
    )
}

const mapStateToProps = (state) => {
  return {
      base_url: state.BASE_URL
  }
}
export default connect(mapStateToProps) (ModalPrivacy)
