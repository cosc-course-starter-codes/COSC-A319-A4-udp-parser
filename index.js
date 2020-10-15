const udp = require('./lib/udp');

/**
 * Parse a UDP packet
 * @param {Buffer} data - the UDP packet data as binary Buffer
 * @param {Buffer} pseudo_header - the IP pseudo-header as binary Buffer
 * @returns {{
 *    protocol: string,
 *    header: {
 *      destination_port: number,
 *      source_port: number,
 *      length: number,
 *      checksum: number
 *    },
 *    pseudo_header: {
 *      pseudo_header_protocol: string,
 *      source_ip: Buffer,
 *      destination_ip: Buffer,
 *      protocol: number,
 *      length: number
 *    },
 *    payload: Buffer,
 *    checksum_valid: boolean
 * }} - an object representing the fields from the UDP packet and pseudo-header
 */
function parse (data, pseudo_header) {
  // start here: this function is the entry point to this library.
  // put any supporting functions (for example, for dealing with
  // parsing of headers or differences between IPv4 and IPv6) in
  // the imported module ./lib/udp.js
}

module.exports = {
  parse
};
