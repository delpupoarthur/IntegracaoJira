import { Embed } from '../model/Embed'
import { EmbedAuthor } from '../model/EmbedAuthor'
import { EmbedField } from '../model/EmbedField'
import { BaseProvider } from '../provider/BaseProvider'
import { MarkdownUtil } from '../util/MarkdownUtil'

/**
 * https://confluence.atlassian.com/bitbucket/manage-webhooks-735643732.html
 */
class BitBucket extends BaseProvider {

    private static _formatLargeString(str, limit = 256) {
        return (str.length > limit ? str.substring(0, limit - 1) + '\u2026' : str)
    }

    private static _titleCase(str: string, ifNull = 'None') {
        if (str == null) {
            return ifNull
        }
        if (str.length < 1) {
            return str
        }
        const strArray = str.toLowerCase().split(' ')
        for (let i = 0; i < strArray.length; i++) {
            strArray[i] = strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1)
        }
        return strArray.join(' ')
    }

    private baseLink: string = 'https://bitbucket.org/'
    private embed: Embed

    constructor() {
        super()
        this.setEmbedColor(0x205081)
        this.embed = new Embed()
    }

    public getName() {
        return 'BitBucket'
    }

    public getType(): string {
        return this.headers['x-event-key']
    }

    public async repoPush() {
        const project = {
            name: this.body.repository.name,
            url: this.baseLink + this.body.repository.full_name,
            branch: null,
            commits: null
        }
        if (this.body.push != null && this.body.push.changes != null) {
            for (let i = 0; (i < this.body.push.changes.length && i < 4); i++) {
                const change = this.body.push.changes[i]
                project.branch = (change.old != null) ? change.old.name : change.new.name
                project.commits = change.commits

                const embed = new Embed()
                if (project.commits != null) {
                    const fields: EmbedField[] = []
                    embed.title = '[' + project.name + ':' + project.branch + '] ' + project.commits.length + ' commit' + ((project.commits.length > 1) ? 's' : '')
                    embed.url = project.url
                    for (let j = project.commits.length - 1; j >= 0; j--) {
                        const commit = project.commits[j]
                        const message = (commit.message.length > 256) ? commit.message.substring(0, 255) + '\u2026' : commit.message
                        const author = (typeof commit.author.user !== 'undefined') ? commit.author.user.display_name : 'Unknown'
                        const field = new EmbedField()
                        field.name = 'Commit from ' + author
                        field.value = '(' + '[`' + commit.hash.substring(0, 7) + '`](' + commit.links.html.href + ')' + ') ' + message.replace(/\n/g, ' ').replace(/\r/g, ' ')
                        fields.push(field)
                    }
                    embed.fields = fields
                } else {
                    if (change.new != null && change.new.type === 'tag') {
                        embed.title = '[' + this.body.repository.full_name + '] New tag created: ' + change.new.name
                        embed.url = change.new.links.html.href
                    }
                }

                embed.author = this.extractAuthor()
                this.addEmbed(embed)
            }
        }
    }

    public async repoFork() {
        this.embed.author = this.extractAuthor()
        this.embed.description = 'Created a [`fork`](' + this.baseLink + this.body.fork.full_name + ') of [`' + this.body.repository.name + '`](' + this.baseLink + this.body.repository.full_name + ')'
        this.addEmbed(this.embed)
    }

    public async repoUpdated() {

        const changes: string[] = []
        if (typeof this.body.changes.name !== 'undefined') {
            changes.push('**Name:** "' + this.body.changes.name.old + '" -> "' + this.body.changes.name.new + '"')
        }
        if (typeof this.body.changes.website !== 'undefined') {
            changes.push('**Website:** "' + this.body.changes.website.old + '" -> "' + this.body.changes.website.new + '"')
        }
        if (typeof this.body.changes.language !== 'undefined') {
            changes.push('**Language:** "' + this.body.changes.language.old + '" -> "' + this.body.changes.language.new + '"')
        }
        if (typeof this.body.changes.description !== 'undefined') {
            changes.push('**Description:** "' + this.body.changes.description.old + '" -> "' + this.body.changes.description.new + '"')
        }

        this.embed.author = this.extractAuthor()
        this.embed.url = this.baseLink + this.body.repository.full_name
        this.embed.description = changes.join('\n')
        this.embed.title = 'Changed general information of ' + this.body.repository.name

        this.addEmbed(this.embed)
    }

    public async repoCommitCommentCreated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Wrote a comment to commit ' + this.body.commit.hash.substring(0, 7) + ' on ' + this.body.repository.name
        this.embed.description = (this.body.comment.content.html.replace(/<.*?>/g, '').length > 1024) ? this.body.comment.content.html.replace(/<.*?>/g, '').substring(0, 1023) + '\u2026' : this.body.comment.content.html.replace(/<.*?>/g, '')
        this.embed.url = this.baseLink + this.body.repository.full_name + '/commits/' + this.body.commit.hash
        this.addEmbed(this.embed)
    }

    public async repoCommitStatusCreated() {
        this.embed.title = this.body.commit_status.name
        this.embed.description = '**State:** ' + this.body.commit_status.state + '\n' + this.body.commit_status.description
        this.embed.url = this.body.commit_status.url
        this.addEmbed(this.embed)
    }

    public async repoCommitStatusUpdated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = this.body.commit_status.name
        this.embed.url = this.body.commit_status.url
        this.embed.description = '**State:** ' + this.body.commit_status.state + '\n' + this.body.commit_status.description
        this.addEmbed(this.embed)
    }

    public async issueCreated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = '[' + this.body.repository.owner.username + '/' + this.body.repository.name + '] Issue Opened: #' + this.body.issue.id + ' ' + this.body.issue.title
        this.embed.url = this.extractIssueUrl()

        const states: string[] = []
        if (this.body.issue.assignee != null && this.body.issue.assignee.display_name != null) {
            states.push('**Assignee:** ' + '[`' + this.body.issue.assignee.display_name + '`](' + this.body.issue.assignee.links.html.href + ')')
        }

        states.push('**State:** `' + BitBucket._titleCase(this.body.issue.state) + '`')
        states.push('**Kind:** `' + BitBucket._titleCase(this.body.issue.kind) + '`')
        states.push('**Priority:** `' + BitBucket._titleCase(this.body.issue.priority) + '`')

        if (this.body.issue.component != null && this.body.issue.component.name != null) {
            states.push('**Component:** `' + BitBucket._titleCase(this.body.issue.component.name) + '`')
        }

        if (this.body.issue.milestone != null && this.body.issue.milestone.name != null) {
            states.push('**Milestone:** `' + BitBucket._titleCase(this.body.issue.milestone.name) + '`')
        }

        if (this.body.issue.version != null && this.body.issue.version.name != null) {
            states.push('**Version:** `' + BitBucket._titleCase(this.body.issue.version.name) + '`')
        }

        if (this.body.issue.content.raw) {
            states.push('**Content:**\n' + MarkdownUtil._formatMarkdown(BitBucket._formatLargeString(this.body.issue.content.raw), this.embed))
        }

        this.embed.description = states.join('\n')

        this.addEmbed(this.embed)
    }

    public async issueUpdated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = '[' + this.body.repository.owner.username + '/' + this.body.repository.name + '] Issue Updated: #' + this.body.issue.id + ' ' + this.body.issue.title
        this.embed.url = this.extractIssueUrl()
        const changes = []

        if (typeof this.body.changes !== 'undefined') {
            const states = ['old', 'new']

            const labels = ['Assignee', 'Responsible']
            labels.forEach((label) => {
                const actor = this.body.changes[label.toLowerCase()]

                if (actor == null) {
                    return
                }

                const actorNames: any = {}
                const unassigned = '`Unassigned`'

                states.forEach((state) => {
                    if (actor[state] != null && actor[state].username != null) {
                        actorNames[state] = '[`' + actor[state].display_name + '`](' + actor[state].links.html.href + ')'
                    } else {
                        actorNames[state] = unassigned
                    }
                })

                if (!Object.keys(actorNames).length || (actorNames.old === unassigned && actorNames.new === unassigned)) {
                    return
                }

                changes.push('**' + label + ':** ' + actorNames.old + ' \uD83E\uDC6A ' + actorNames.new)
            });

            ['Kind', 'Priority', 'Status', 'Component', 'Milestone', 'Version'].forEach((label) => {
                const property = this.body.changes[label.toLowerCase()]

                if (typeof property !== 'undefined') {
                    changes.push('**' + label + ':** `' + BitBucket._titleCase(property.old) + '` \uD83E\uDC6A `' + BitBucket._titleCase(property.new) + '`')
                }
            })

            {
                const label = 'Content'
                const property = this.body.changes[label.toLowerCase()]

                if (typeof property !== 'undefined') {
                    changes.push('**New ' + label + ':** \n' + MarkdownUtil._formatMarkdown(BitBucket._formatLargeString(property.new), this.embed))
                }
            }
        }

        this.embed.description = changes.join('\n')

        this.addEmbed(this.embed)
    }

    public async issueCommentCreated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = '[' + this.body.repository.owner.username + '/' + this.body.repository.name + '] New comment on issue #' + this.body.issue.id + ': ' + this.body.issue.title
        this.embed.url = this.extractIssueUrl()
        this.embed.description = MarkdownUtil._formatMarkdown(BitBucket._formatLargeString(this.body.comment.content.raw), this.embed)
        this.addEmbed(this.embed)
    }

    public async pullrequestCreated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Created a new pull request on ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.embed.description = this.body.pullrequest.description
        this.embed.fields = [this.extractPullRequestField()]
        this.addEmbed(this.embed)
    }

    public async pullrequestUpdated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Updated pull request #' + this.body.pullrequest.id + ' on ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.embed.description = this.body.pullrequest.description
        this.embed.fields = [this.extractPullRequestField()]
        this.addEmbed(this.embed)
    }

    public async pullrequestApproved() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Approved pull request #' + this.body.pullrequest.id + ' on ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.addEmbed(this.embed)
    }

    public async pullrequestUnapproved() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Removed his approval for pull request #' + this.body.pullrequest.id + ' on ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.addEmbed(this.embed)
    }

    public async pullrequestFulfilled() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Merged pull request #' + this.body.pullrequest.id + ' into ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.addEmbed(this.embed)
    }

    public async pullrequestRejected() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Declined pull request #' + this.body.pullrequest.id + ' on ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.embed.description = (typeof this.body.pullrequest.reason !== 'undefined') ? ((this.body.pullrequest.reason.replace(/<.*?>/g, '').length > 1024) ? this.body.pullrequest.reason.replace(/<.*?>/g, '').substring(0, 1023) + '\u2026' : this.body.pullrequest.reason.replace(/<.*?>/g, '')) : ''
        this.addEmbed(this.embed)
    }

    public async pullrequestCommentCreated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Wrote a comment to pull request #' + this.body.pullrequest.id + ' on ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.embed.description = (this.body.comment.content.html.replace(/<.*?>/g, '').length > 1024) ? this.body.comment.content.html.replace(/<.*?>/g, '').substring(0, 1023) + '\u2026' : this.body.comment.content.html.replace(/<.*?>/g, '')
        this.addEmbed(this.embed)
    }

    public async pullrequestCommentUpdated() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Updated a comment at pull request #' + this.body.pullrequest.id + ' on ' + this.body.repository.name
        this.embed.url = this.extractPullRequestUrl()
        this.embed.description = (this.body.comment.content.html.replace(/<.*?>/g, '').length > 1024) ? this.body.comment.content.html.replace(/<.*?>/g, '').substring(0, 1023) + '\u2026' : this.body.comment.content.html.replace(/<.*?>/g, '')
        this.addEmbed(this.embed)
    }

    public async pullrequestCommentDeleted() {
        this.embed.author = this.extractAuthor()
        this.embed.title = 'Deleted a comment at pull request #' + this.body.pullrequest.id + ' on ' + this.body.repository.name
        this.embed.description = (this.body.comment.content.html.replace(/<.*?>/g, '').length > 1024) ? this.body.comment.content.html.replace(/<.*?>/g, '').substring(0, 1023) + '\u2026' : this.body.comment.content.html.replace(/<.*?>/g, '')
        this.embed.url = this.extractPullRequestUrl()
        this.addEmbed(this.embed)
    }

    private extractAuthor(): EmbedAuthor {
        const author = new EmbedAuthor()
        author.name = this.body.actor.display_name
        if (this.body.actor.links === undefined) {
            author.iconUrl = 'http://i0.wp.com/avatar-cdn.atlassian.com/default/96.png'
            author.url = ''
        } else {
            author.iconUrl = this.body.actor.links.avatar.href
            author.url = this.baseLink + this.body.actor.username
        }
        return author
    }

    private extractPullRequestUrl(): string {
        return this.baseLink + this.body.repository.full_name + '/pull-requests/' + this.body.pullrequest.id
    }

    private extractPullRequestField(): EmbedField {
        const field = new EmbedField()
        field.name = this.body.pullrequest.title
        field.value = '**Destination branch:** ' + this.body.pullrequest.destination.branch.name + '\n' + '**State:** ' + this.body.pullrequest.state + '\n'
        return field
    }

    private extractIssueUrl(): string {
        return this.baseLink + this.body.repository.full_name + '/issues/' + this.body.issue.id
    }
}

export { BitBucket }
