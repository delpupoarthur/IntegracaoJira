import { Pingdom } from '../src/provider/Pingdom'
import { Tester } from './Tester'

const json = {
    check_id: 12345,
    check_name: 'Name of HTTP check',
    check_type: 'HTTP',
    check_params: {
        basic_auth: false,
        encryption: true,
        full_url: 'https://www.example.com/path',
        header: 'User-Agent:Pingdom.com_bot',
        hostname: 'www.example.com',
        ipv6: false,
        port: 443,
        url: '/path'
    },
    tags: [
        'example_tag'
    ],
    previous_state: 'UP',
    current_state: 'DOWN',
    importance_level: 'HIGH',
    state_changed_timestamp: 1451610061,
    state_changed_utc_time: '2016-01-01T01:01:01',
    long_description: 'Long error message',
    description: 'Short error message',
    first_probe: {
        ip: '123.4.5.6',
        ipv6: '2001:4800:1020:209::5',
        location: 'Stockholm, Sweden'
    },
    second_probe: {
        ip: '123.4.5.6',
        ipv6: '2001:4800:1020:209::5',
        location: 'Austin, US',
        version: 1
    }
}

describe('/POST pingdom', () => {
    it('check', async () => {
        await Tester.test(new Pingdom(), 'pingdom.json', null)
    })
})
