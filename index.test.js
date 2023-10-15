require('jest');
const udp = require('./index');
const fixture = require('./test_fixtures/udp_packet');

describe('parse', () => {
  let packet, ip4_pseudo_header, expected, result;
  beforeEach(() => {
    packet = fixture.ip4_packet;
    ip4_pseudo_header = fixture.ip4_pseudo_header;
    expected = fixture.parsed;
    result = udp.parse(packet, ip4_pseudo_header);
  });

  test('it should not error on parseable packets', () => {
    expect(() => { udp.parse(packet, ip4_pseudo_header); }).not.toThrow();
  });
  test('it should error on incomplete packets', () => {
    expect(() => { udp.parse(packet.subarray(0, 30), ip4_pseudo_header); })
      .toThrow('Incomplete packet: expected length 271, received 30');
  });

  describe('packet header', () => {
    test('it should include the protocol in the result', () => {
      expect(result).toHaveProperty('protocol');
      expect(result.protocol).toEqual('UDP');
    });
    test('it parses header data into a header segment', () => {
      expect(result).toHaveProperty('header');
      expect(result.header).toBeInstanceOf(Object);
    });
    test('it should parse the destination port', () => {
      expect(result.header).toHaveProperty('destination_port');
      expect(result.header.destination_port)
        .toEqual(expected.header.destination_port);
    });
    test('it should parse the source port', () => {
      expect(result.header).toHaveProperty('source_port');
      expect(result.header.source_port)
        .toEqual(expected.header.source_port);
    });
    test('it should provide the packet length', () => {
      expect(result.header).toHaveProperty('length');
      expect(result.header.length).toEqual(expected.header.length);
    });
  });

  describe('packet datagram data', () => {
    test('it should provide the payload', () => {
      expect(result).toHaveProperty('payload');
      expect(result.payload).toEqual(expected.payload);
    });
  });

  describe('IPv4', () => {
    let packet, ip4_pseudo_header;
    beforeEach(() => {
      packet = fixture.ip4_packet;
      ip4_pseudo_header = fixture.ip4_pseudo_header;
      result = udp.parse(packet, ip4_pseudo_header);
    });

    describe('pseudo-header', () => {
      test('it should provide the pseudo-header used for the checksum', () => {
        expect(result).toHaveProperty('pseudo_header');
        expect(result.pseudo_header).toBeInstanceOf(Object);
      });

      test('it should provide the pseudo-header protocol', () => {
        expect(result.pseudo_header).toHaveProperty('pseudo_header_protocol');
        expect(result.pseudo_header.pseudo_header_protocol)
          .toEqual(expected.pseudo_header.ip4.pseudo_header_protocol);
      });
      test('it should provide the source IP address', () => {
        expect(result.pseudo_header).toHaveProperty('source_ip');
        expect(result.pseudo_header.source_ip)
          .toEqual(expected.pseudo_header.ip4.source_ip);
      });
      test('it should provide the destination IP address', () => {
        expect(result.pseudo_header).toHaveProperty('destination_ip');
        expect(result.pseudo_header.destination_ip)
          .toEqual(expected.pseudo_header.ip4.destination_ip);
      });
      test('it should provide the protocol value from the IP header', () => {
        expect(result.pseudo_header).toHaveProperty('protocol');
        expect(result.pseudo_header.protocol)
          .toEqual(expected.pseudo_header.ip4.protocol);
      });
      test('it should provide the UDP length from the IP header', () => {
        expect(result.pseudo_header).toHaveProperty('length');
        expect(result.pseudo_header.length)
          .toEqual(expected.pseudo_header.ip4.length);
      });
    });

    describe('packet checksum', () => {
      test('it should provide the checksum from the packet header', () => {
        expect(result.header).toHaveProperty('checksum');
        expect(result.header.checksum).toEqual(expected.header.checksum_ip4);
      });

      describe('when checksum value matches', () => {
        beforeEach(() => {
          result = udp.parse(packet, ip4_pseudo_header);
        });
        test('it should provide a checksum_valid status of true', () => {
          expect(result).toHaveProperty('checksum_valid');
          expect(result.checksum_valid).toBe(true);
        });
      });
      describe('when checksum value does not match', () => {
        beforeEach(() => {
          const alteredPacket = Buffer.from(packet);
          alteredPacket.writeUInt16BE(2536);
          result = udp.parse(alteredPacket, ip4_pseudo_header);
        });
        test('it should provide a checksum_valid status of false', () => {
          expect(result).toHaveProperty('checksum_valid');
          expect(result.checksum_valid).toBe(false);
        });
      });
    });
  });

  describe('IPv6', () => {
    let packet, ip6_pseudo_header;
    beforeEach(() => {
      packet = fixture.ip6_packet;
      ip6_pseudo_header = fixture.ip6_pseudo_header;
      result = udp.parse(packet, ip6_pseudo_header);
    });

    describe('pseudo-header', () => {
      test('it should provide the pseudo-header protocol', () => {
        expect(result.pseudo_header).toHaveProperty('pseudo_header_protocol');
        expect(result.pseudo_header.pseudo_header_protocol)
          .toEqual(expected.pseudo_header.ip6.pseudo_header_protocol);
      });
      test('it should provide the source IP address', () => {
        expect(result.pseudo_header).toHaveProperty('source_ip');
        expect(result.pseudo_header.source_ip)
          .toEqual(expected.pseudo_header.ip6.source_ip);
      });
      test('it should provide the destination IP address', () => {
        expect(result.pseudo_header).toHaveProperty('destination_ip');
        expect(result.pseudo_header.destination_ip)
          .toEqual(expected.pseudo_header.ip6.destination_ip);
      });
      test('it should provide the protocol value from the IP header', () => {
        expect(result.pseudo_header).toHaveProperty('protocol');
        expect(result.pseudo_header.protocol)
          .toEqual(expected.pseudo_header.ip6.protocol);
      });
      test('it should provide the UDP length from the IP header', () => {
        expect(result.pseudo_header).toHaveProperty('length');
        expect(result.pseudo_header.length)
          .toEqual(expected.pseudo_header.ip6.length);
      });
    });

    describe('packet checksum', () => {
      test('it should provide the checksum from the packet header', () => {
        expect(result.header).toHaveProperty('checksum');
        expect(result.header.checksum).toEqual(expected.header.checksum_ip6);
      });

      describe('when checksum value matches', () => {
        beforeEach(() => {
          result = udp.parse(packet, ip6_pseudo_header);
        });
        test('it should provide a checksum_valid status of true', () => {
          expect(result).toHaveProperty('checksum_valid');
          expect(result.checksum_valid).toBe(true);
        });
      });
      describe('when checksum value does not match', () => {
        beforeEach(() => {
          const alteredPacket = Buffer.from(packet);
          alteredPacket.writeUInt16BE(2536);
          result = udp.parse(alteredPacket, ip6_pseudo_header);
        });
        test('it should provide a checksum_valid status of false', () => {
          expect(result).toHaveProperty('checksum_valid');
          expect(result.checksum_valid).toBe(false);
        });
      });
    });
  });
});
