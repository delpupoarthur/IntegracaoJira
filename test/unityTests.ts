import { Unity } from '../src/providers/Unity'
import { Tester } from './Tester'

const json = {
    projectName: 'My Project',
    buildTargetName: 'Mac desktop 32-bit build',
    projectGuid: '0895432b-43a2-4fd3-85f0-822d8fb607ba',
    orgForeignKey: '13260',
    buildNumber: 14,
    buildStatus: 'queued',
    startedBy: 'Build User <builduser@domain.com>',
    platform: 'standaloneosxintel',
    links: {
        api_self: {
            method: 'get',
            href: '/api/orgs/my-org/projects/my-project/buildtargets/mac-desktop-32-bit-build/builds/14'
        },
        dashboard_url: {
            method: 'get',
            href: 'https://build.cloud.unity3d.com'
        },
        dashboard_project: {
            method: 'get',
            href: '/build/orgs/stephenp/projects/assetbundle-demo-1'
        },
        dashboard_summary: {
            method: 'get',
            href: '/build/orgs/my-org/projects/my-project/buildtargets/mac-desktop-32-bit-build/builds/14/summary'
        },
        dashboard_log: {
            method: 'get',
            href: '/build/orgs/my-org/projects/my-project/buildtargets/mac-desktop-32-bit-build/builds/14/log'
        }
    }
}

describe('/POST unity', () => {
    it('build', async () => {
        Tester.test(new Unity(), json, null)
    })
})
