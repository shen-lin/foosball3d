export default class {
  client_id: string;
  client_session_id: string;
  fb_client_id: string;
  fb_client_name: string;
  ready: boolean;

  constructor(
    client_id: string,
    client_session_id: string,
    fb_client_id: string,
    fb_client_name: string,
    ready: boolean
  ) {
    this.client_id = client_id;
    this.client_session_id = client_session_id;
    this.fb_client_id = fb_client_id;
    this.fb_client_name = fb_client_name;
    this.ready = ready;
  }
}
